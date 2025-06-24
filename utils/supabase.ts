import { createClient } from '@supabase/supabase-js';

import { Database } from '~/types/database.types';

const supabaseUrl = 'https://1bcd-24-242-137-154.ngrok-free.app';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl as string, supabaseAnonKey as string);
