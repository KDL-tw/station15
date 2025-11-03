import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE;

  if (!supabaseUrl || (!supabaseAnonKey && !supabaseServiceKey)) {
    throw new Error('Missing Supabase environment variables');
  }

  // Use service role key for server-side operations (bypasses RLS)
  const key = supabaseServiceKey || supabaseAnonKey;

  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
    },
  });
}

// Client-side Supabase client (for use in components)
export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

