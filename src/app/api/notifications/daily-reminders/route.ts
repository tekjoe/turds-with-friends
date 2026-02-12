import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendDailyReminder } from '@/lib/notifications/helpers';

/**
 * Daily Reminder Endpoint
 *
 * This endpoint should be called by a cron job (e.g., Vercel Cron, GitHub Actions, or cron-job.org)
 * to send daily reminders to users who haven't logged today.
 *
 * To set up a cron job:
 * 1. For Vercel: Add to vercel.json:
 *    {
 *      "crons": [{
 *        "path": "/api/notifications/daily-reminders",
 *        "schedule": "0 9 * * *"
 *      }]
 *    }
 *
 * 2. For external cron (cron-job.org):
 *    Create a job that makes a POST request to this endpoint daily
 *
 * 3. Add authorization header for security (optional but recommended)
 */
export async function POST(request: Request) {
  try {
    // Optional: Verify request is from authorized source (skip in development)
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (!isDevelopment) {
      const authHeader = request.headers.get('authorization');
      const cronSecret = process.env.CRON_SECRET;

      if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const supabase = await createClient();

    // Get all users who have FCM tokens (opted into notifications)
    const { data: usersWithTokens } = await supabase
      .from('fcm_tokens')
      .select('user_id');

    if (!usersWithTokens || usersWithTokens.length === 0) {
      return NextResponse.json({
        message: 'No users with notification tokens found',
        sent: 0,
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get users who haven't logged today
    const userIds = usersWithTokens.map(u => u.user_id);

    const { data: todaysLogs } = await supabase
      .from('movement_logs')
      .select('user_id')
      .in('user_id', userIds)
      .gte('created_at', today.toISOString());

    // Create set of users who already logged today
    const loggedTodaySet = new Set(todaysLogs?.map(log => log.user_id) || []);

    // Filter to users who haven't logged today
    const usersToNotify = userIds.filter(userId => !loggedTodaySet.has(userId));

    if (usersToNotify.length === 0) {
      return NextResponse.json({
        message: 'All users have already logged today',
        sent: 0,
      });
    }

    // Send reminders
    const results = await Promise.allSettled(
      usersToNotify.map(userId => sendDailyReminder(userId))
    );

    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const failureCount = results.filter(r => r.status === 'rejected').length;

    return NextResponse.json({
      success: true,
      message: 'Daily reminders sent',
      sent: successCount,
      failed: failureCount,
      total: usersToNotify.length,
    });
  } catch (error) {
    console.error('Error sending daily reminders:', error);
    return NextResponse.json(
      { error: 'Failed to send daily reminders' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for testing/manual trigger
 */
export async function GET() {
  return NextResponse.json({
    message: 'Daily reminders endpoint',
    usage: 'Send a POST request to trigger daily reminders',
    setup: 'Configure a cron job to call this endpoint daily',
  });
}
