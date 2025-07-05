import { createClient } from '@supabase/supabase-js';

import { getOrCreateDeviceId } from '~/services/device/deviceId';
import { Database } from '~/types/database.types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl as string, supabaseAnonKey as string, {
  global: {
    headers: {
      'x-device-id': getOrCreateDeviceId(),
    },
  },
});
