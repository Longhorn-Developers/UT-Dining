// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);
const BATCH_SIZE = 100;

console.log('🔍 Starting manual push notification function...');

Deno.serve(async (req) => {
  const { title, body, redirect_url, type } = await req.json();

  const { data: userDevices } = await supabase.from('user_devices').select('push_token');
  console.log('🔍 User devices:', JSON.stringify(userDevices, null, 2));
  // Get unique push tokens
  const pushTokens = [...new Set(userDevices.map((device) => device.push_token))];

  // Batch tokens into groups of 100
  const tokenBatches = [];

  for (let i = 0; i < pushTokens.length; i += BATCH_SIZE) {
    tokenBatches.push(pushTokens.slice(i, i + BATCH_SIZE));
  }

  const sentAt = new Date().toISOString();

  // Send notifications to each batch
  const sendPromises = tokenBatches.map(async (tokenBatch) => {
    const notificationMessage = {
      to: tokenBatch,
      sound: 'default',
      title,
      body,
      data: { redirect_url, type, sent_at: sentAt },
    };

    return fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Deno.env.get('EXPO_ACCESS_TOKEN')}`,
      },
      body: JSON.stringify(notificationMessage),
    });
  });

  // Wait for all batches to be sent
  await Promise.all(sendPromises);

  // Create new row in notifications table
  const { error } = await supabase.from('notifications').insert({
    title,
    body,
    redirect_url,
    type,
    sent: true,
  });

  if (error) {
    console.error('❌ Error inserting notification:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(
    JSON.stringify({
      success: true,
      sent: pushTokens.length,
      title,
      body,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/manual-push-notification' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"title":"Test Notification","body":"Hello from the app!"}'

*/
