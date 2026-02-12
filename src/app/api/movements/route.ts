import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { notifyFriendsOfMovement } from '@/lib/notifications/helpers';

export async function POST(request: Request) {
  try {
    const {
      bristol_type,
      pre_weight,
      post_weight,
      weight_unit,
    } = await request.json();

    if (!bristol_type || bristol_type < 1 || bristol_type > 7) {
      return NextResponse.json(
        { error: 'Valid bristol_type (1-7) is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile for display name
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, username')
      .eq('id', user.id)
      .single();

    const displayName = profile?.display_name || profile?.username || 'A friend';

    // Create the movement log
    const { data: logData, error: insertError } = await supabase
      .from('movement_logs')
      .insert({
        user_id: user.id,
        bristol_type,
        pre_weight: pre_weight ? parseFloat(pre_weight) : null,
        post_weight: post_weight ? parseFloat(post_weight) : null,
        weight_unit: weight_unit || 'lbs',
        xp_earned: 50,
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Error creating movement log:', insertError);
      throw insertError;
    }

    // Notify friends asynchronously (don't wait for it)
    notifyFriendsOfMovement(user.id, displayName).catch(error => {
      console.error('Failed to notify friends:', error);
    });

    return NextResponse.json({
      success: true,
      data: logData,
    });
  } catch (error) {
    console.error('Error in POST /api/movements:', error);
    return NextResponse.json(
      { error: 'Failed to create movement log' },
      { status: 500 }
    );
  }
}
