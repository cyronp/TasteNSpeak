import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

  if (typeof window !== 'undefined' && 
      (supabaseUrl === 'https://placeholder.supabase.co' || supabaseKey === 'placeholder-key')) {
    console.error(
      "Missing Supabase environment variables. Please check your .env.local file."
    );
    throw new Error(
      "Supabase not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local"
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
};
