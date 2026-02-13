import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // Durante o build, permitir valores vazios
  // Em runtime (no navegador), verificar se estão configurados
  if (typeof window !== 'undefined' && (!supabaseUrl || !supabaseKey)) {
    console.error(
      "Missing Supabase environment variables. Please check your .env.local file."
    );
    throw new Error(
      "Supabase not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY to .env.local"
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
};
