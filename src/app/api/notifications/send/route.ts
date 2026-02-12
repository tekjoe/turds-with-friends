import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { messaging } from '@/lib/firebase/admin';

export async function POST(request: Request) {
  try {
    const { userId, title, body, data } = await request.json();

    if (!userId || !title || !body) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, title, body' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify the requesting user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's FCM token
    const { data: tokenData, error: tokenError } = await supabase
      .from('fcm_tokens')
      .select('token')
      .eq('user_id', userId)
      .single();

    if (tokenError || !tokenData) {
      console.log(`No FCM token found for user ${userId}`);
      return NextResponse.json(
        { error: 'No FCM token found for user' },
        { status: 404 }
      );
    }

    // Send notification
    const message = {
      token: tokenData.token,
      notification: {
        title,
        body,
      },
      data: data || {},
      webpush: {
        notification: {
          icon: '/icon-192x192.png',
          badge: '/icon-72x72.png',
        },
      },
    };

    const response = await messaging.send(message);
    console.log('Successfully sent message:', response);

    return NextResponse.json({ success: true, messageId: response });
  } catch (error) {
    console.error('Error sending notification:', error);

    // Handle invalid FCM token errors
    if (error instanceof Error && error.message.includes('registration-token-not-registered')) {
      // Token is invalid, we should delete it from the database
      const { userId } = await request.json();
      const supabase = await createClient();
      await supabase.from('fcm_tokens').delete().eq('user_id', userId);

      return NextResponse.json(
        { error: 'Invalid FCM token, removed from database' },
        { status: 410 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
