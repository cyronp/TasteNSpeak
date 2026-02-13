import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  // Aceita ambos os formatos: NEXT_PUBLIC_* ou sem prefixo
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-key';

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
