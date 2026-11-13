# Russelle & Rosie – wedding site (Next.js)

Garden-themed wedding page with a scroll-driven zoom-in intro and one-time, expiring RSVP links saved to Supabase.

## Run it
```bash
npm install
cp .env.example .env.local   # then fill in your Supabase URL, service role key, and admin access key
npm run dev                  # http://localhost:3000
```

The form posts to `/api/rsvp`, a server route that saves to Supabase with the **service role key**.
That key bypasses Row Level Security, so it must stay on the server:
never prefix it with `NEXT_PUBLIC_`, never commit `.env.local`, and add it in Vercel as a normal (non-public) variable.
Open `/admin` to email invitation links to multiple guests. Set a long random `ADMIN_ACCESS_KEY` in the server environment and enter it on that page; the key is not stored in the browser. Enter one guest per line as `Name, email`, choose an expiry date, and send. Each guest receives a unique link stored as a SHA-256 token hash; it can only be used for one successful RSVP. Email is sent with Resend, so configure `RESEND_API_KEY` and `INVITATION_FROM_EMAIL` with an address on a verified Resend domain.

## Supabase table
Run this in the Supabase SQL editor. If you already created `rsvps` using the previous version of this README, first rename its columns to match the server:
```sql
alter table rsvps rename column name to guest_name;
alter table rsvps rename column attending to attendance;
alter table rsvps rename column dietary_notes to dietary_requirements;
```

Then create the tables and function:
```sql
create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  guest_name text not null,
  email text not null,
  phone text,
  attendance text not null check (attendance in ('accept','decline')),
  allergies text[] not null default '{}',
  dietary_requirements text,
  message text
);

create table if not exists invitation_tokens (
  token_hash text primary key,
  guest_name text,
  email text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  is_valid boolean not null default true
);

alter table public.invitation_tokens add column if not exists guest_name text;
alter table public.invitation_tokens add column if not exists email text;

alter table rsvps enable row level security;
alter table invitation_tokens enable row level security;

create or replace function public.submit_rsvp_once(p_token_hash text, p_rsvp jsonb)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.invitation_tokens
  set is_valid = false
  where token_hash = p_token_hash
    and is_valid = true
    and expires_at > statement_timestamp();

  if not found then
    return false;
  end if;

  insert into public.rsvps (
    guest_name, email, phone, attendance, allergies, dietary_requirements, message
  ) values (
    p_rsvp->>'guest_name',
    p_rsvp->>'email',
    p_rsvp->>'phone',
    p_rsvp->>'attendance',
    array(select jsonb_array_elements_text(coalesce(p_rsvp->'allergies', '[]'::jsonb))),
    p_rsvp->>'dietary_requirements',
    p_rsvp->>'message'
  );

  return true;
end;
$$;

revoke all on function public.submit_rsvp_once(text, jsonb) from public, anon, authenticated;
grant execute on function public.submit_rsvp_once(text, jsonb) to service_role;
```
The token update and RSVP insert run in one database transaction: a failed insert does not consume the link, and concurrent/repeated submissions cannot reuse it.

## Deploy
Push to GitHub and import into Vercel. Add `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_ACCESS_KEY`, `RESEND_API_KEY`, and `INVITATION_FROM_EMAIL` in the project settings.

## Where things are
- `app/globals.css` – colours (`#DFDED9`, `#5F6831`, `#9A7A54`), layout, mobile blur
- `components/ZoomScenes.jsx` – pinned zoom sequence (change copy and details here)
- `components/RsvpSection.jsx` – the RSVP form
- `app/api/rsvp/route.js` – server route that validates and saves RSVPs
- `app/admin/page.js` – admin-key-protected bulk invitation email page (`/admin`)
- `components/GardenDefs.jsx` – baby's breath / leaf artwork
