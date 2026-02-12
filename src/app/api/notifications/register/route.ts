import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Save FCM token to database
    const { error } = await supabase
      .from('fcm_tokens')
      .upsert({
        user_id: user.id,
        token: token,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      });

    if (error) {
      console.error('Error saving FCM token:', error);
      throw error;
    }

    return NextResponse.json({ success: true, message: 'FCM token saved successfully' });
  } catch (error) {
    console.error('Error in /api/notifications/register:', error);
    return NextResponse.json(
      { error: 'Failed to save token' },
      { status: 500 }
    );
  }
}
