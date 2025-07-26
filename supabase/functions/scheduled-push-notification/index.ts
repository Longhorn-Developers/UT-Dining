// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
);
const BATCH_SIZE = 100;
console.log('🔍 Starting scheduled push notification function...');
Deno.serve(async (_req) => {
  try {
    // Get current time in Central Time Zone
    const now = new Date();
    const centralTime = new Date(
      now.toLocaleString('en-US', {
        timeZone: 'America/Chicago',
      }),
    );
    console.log('🕐 Current Central Time:', centralTime.toISOString());
    // Query for scheduled notifications that are due and haven't been sent
    const { data: scheduledNotifications, error: queryError } = await supabase
      .from('notifications')
      .select('*')
      .not('scheduled_at', 'is', null)
      .eq('sent', false)
      .gte('scheduled_at', centralTime.toISOString());

    if (queryError) {
      console.error('❌ Error querying scheduled notifications:', queryError);
      return new Response(
        JSON.stringify({
          error: 'Failed to query scheduled notifications',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }
    console.log('📋 Found scheduled notifications:', scheduledNotifications?.length || 0);
    if (!scheduledNotifications || scheduledNotifications.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No scheduled notifications to send',
          processed: 0,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }
    // Get all user devices with push tokens
    const { data: userDevices, error: devicesError } = await supabase
      .from('user_devices')
      .select('push_token');
    if (devicesError) {
      console.error('❌ Error fetching user devices:', devicesError);
      return new Response(
        JSON.stringify({
          error: 'Failed to fetch user devices',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }
    console.log('📱 Total user devices:', userDevices?.length || 0);
    // Get unique push tokens
    const pushTokens = [
      ...new Set(userDevices?.map((device) => device.push_token).filter(Boolean) || []),
    ];
    console.log('📨 Unique push tokens:', pushTokens.length);
    if (pushTokens.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No push tokens available',
          processed: 0,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }
    // Process each scheduled notification
    const processedNotifications = [];
    for (const notification of scheduledNotifications) {
      console.log(`📤 Processing notification: ${notification.id}`);
      try {
        // Batch tokens into groups of 100
        const tokenBatches = [];
        for (let i = 0; i < pushTokens.length; i += BATCH_SIZE) {
          tokenBatches.push(pushTokens.slice(i, i + BATCH_SIZE));
        }
        // Send notifications to each batch
        const sendPromises = tokenBatches.map(async (tokenBatch) => {
          const notificationMessage = {
            to: tokenBatch,
            sound: 'default',
            title: notification.title,
            body: notification.body,
            data: {
              redirect_url: notification.redirect_url,
              type: notification.type,
              sent_at: new Date().toISOString(),
            },
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
        // Mark notification as sent
        const { error: updateError } = await supabase
          .from('notifications')
          .update({
            sent: true,
          })
          .eq('id', notification.id);
        if (updateError) {
          console.error(`❌ Error marking notification ${notification.id} as sent:`, updateError);
        } else {
          console.log(`✅ Notification ${notification.id} sent successfully`);
          processedNotifications.push({
            id: notification.id,
            title: notification.title,
            sent_to: pushTokens.length,
            scheduled_at: notification.scheduled_at,
          });
        }
      } catch (error) {
        console.error(`❌ Error processing notification ${notification.id}:`, error);
      }
    }
    console.log(
      '📤 Returning response: ',
      JSON.stringify(
        {
          success: true,
          processed: processedNotifications.length,
          total_recipients: pushTokens.length,
          notifications: processedNotifications,
        },
        null,
        2,
      ),
    );
    return new Response(
      JSON.stringify({
        success: true,
        processed: processedNotifications.length,
        total_recipients: pushTokens.length,
        notifications: processedNotifications,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}); /* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/scheduled-push-notification' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{}'

  Note: This function processes scheduled notifications automatically, so no body data is required.

*/
