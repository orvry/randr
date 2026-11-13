# Russelle & Rosie – wedding site (Next.js)

Garden-themed wedding page with a scroll-driven zoom-in intro and an RSVP form that saves to Supabase.

## Run it
```bash
npm install
cp .env.example .env.local   # then fill in your Supabase URL + service role key
npm run dev                  # http://localhost:3000
```

The form posts to `/api/rsvp`, a server route that saves to Supabase with the **service role key**.
That key bypasses Row Level Security, so it must stay on the server:
never prefix it with `NEXT_PUBLIC_`, never commit `.env.local`, and add it in Vercel as a normal (non-public) variable.

## Supabase table
Run this once in the Supabase SQL editor:
```sql
create table rsvps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  phone text,
  attending text not null check (attending in ('accept','decline')),
  allergies text[] default '{}',
  dietary_notes text,
  message text
);
alter table rsvps enable row level security;  -- no public policies: only the server can read or write
```

## Deploy
Push to GitHub and import into Vercel. Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the project settings.

## Where things are
- `lib/story.js` – all story text and photo paths. Text in [brackets] is a placeholder and shows highlighted until replaced
- `public/photos/` – drop your photos here (file names listed in the README inside)
- `components/Hero.jsx` (GSAP) · `Couple.jsx` (Framer Motion) · `Polaroids.jsx` (GSAP, pinned) · `Adventures.jsx` (GSAP, pinned horizontal reel) · `Proposal.jsx` (GSAP, pinned) · `Invitation.jsx` (CSS + Framer Motion)
- `components/Garnish.jsx` (swaying baby’s breath) · `components/Owl.jsx` (owl accents)
- `components/ChapterNav.jsx` – chapter dots on the right
- `components/RsvpSection.jsx` + `app/api/rsvp/route.js` – RSVP form and server-side save
- `app/globals.css` – palette (olive `#5F6831`, tan `#9A7A54`, ivory, champagne) and all layout

Phones get shorter pins, and the adventure reel becomes a normal swipe row. With "reduce motion" on, every chapter is a static layout.
