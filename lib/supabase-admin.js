import { createClient } from '@supabase/supabase-js';

// Server-only client. SUPABASE_SERVICE_ROLE_KEY has no NEXT_PUBLIC_ prefix,
// so Next.js never sends it to the browser. Only import this from route handlers.
export function getAdminClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
