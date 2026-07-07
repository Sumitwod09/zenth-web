import { createClient } from '@supabase/supabase-js';

// Get these from your environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a Supabase client configured to use the Clerk auth token
export const createClerkSupabaseClient = (clerkToken: string | null) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: clerkToken ? {
        Authorization: `Bearer ${clerkToken}`,
      } : undefined,
    },
    // We don't need Supabase's native auth persistence because Clerk handles it
    auth: {
      persistSession: false,
    }
  });
};
