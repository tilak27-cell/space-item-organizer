
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
