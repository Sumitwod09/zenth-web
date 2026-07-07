import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Create a Supabase client that uses the Clerk JWT for authentication.
 * The token is passed as a Bearer header so Supabase RLS policies
 * can use auth.uid() to scope data per user.
 */
export function createClerkSupabaseClient(clerkToken: string | null): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: clerkToken
        ? { Authorization: `Bearer ${clerkToken}` }
        : undefined,
    },
    auth: {
      persistSession: false,
    },
  });
}
