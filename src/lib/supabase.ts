
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Use import.meta.env which is the correct way to access environment variables in Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please check your .env.local file');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
