import { createClient } from '@supabase/supabase-js';

import { Database } from '~/types/database.types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl as string, supabaseAnonKey as string, {
  // auth: {
  //   storage: AsyncStorage,
  //   autoRefreshToken: true,
  //   persistSession: true,
  //   detectSessionInUrl: false,
  // },
});
