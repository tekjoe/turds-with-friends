import { createClient } from '@/lib/supabase/server';

export interface NotificationPayload {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

/**
 * Send a notification to a specific user
 */
export async function sendNotificationToUser(payload: NotificationPayload) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to send notification:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
}

/**
 * Get all friends of a user who have accepted friend requests
 */
export async function getUserFriends(userId: string) {
  const supabase = await createClient();

  const { data: friendships } = await supabase
    .from('friendships')
    .select('user_id, friend_id')
    .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
    .eq('status', 'accepted');

  if (!friendships) return [];

  // Extract friend IDs (excluding the user themselves)
  const friendIds = friendships.map(f =>
    f.user_id === userId ? f.friend_id : f.user_id
  );

  return friendIds;
}

/**
 * Notify all friends when a user logs a movement
 */
export async function notifyFriendsOfMovement(userId: string, userName: string) {
  try {
    const friendIds = await getUserFriends(userId);

    if (friendIds.length === 0) {
      console.log('No friends to notify');
      return;
    }

    const notifications = friendIds.map(friendId =>
      sendNotificationToUser({
        userId: friendId,
        title: '💩 Friend Activity',
        body: `${userName} just logged a movement!`,
        data: {
          type: 'friend_activity',
          userId: userId,
        },
      })
    );

    await Promise.allSettled(notifications);
    console.log(`Sent notifications to ${friendIds.length} friends`);
  } catch (error) {
    console.error('Error notifying friends:', error);
  }
}

/**
 * Send a daily reminder notification to a user
 */
export async function sendDailyReminder(userId: string) {
  const messages = [
    "Don't forget to track your bowel movement today!",
    "Time to log your daily movement!",
    "Your daily tracking reminder is here!",
    "Keep your streak alive - log your movement!",
    "A regular tracking habit leads to better health insights!",
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return sendNotificationToUser({
    userId,
    title: '🚽 Daily Reminder',
    body: randomMessage,
    data: {
      type: 'daily_reminder',
    },
  });
}

/**
 * Notify user of a streak milestone
 */
export async function notifyStreakMilestone(userId: string, streakDays: number) {
  if (streakDays % 7 !== 0) return; // Only notify on weekly milestones

  return sendNotificationToUser({
    userId,
    title: '🔥 Streak Milestone!',
    body: `Amazing! You've reached a ${streakDays}-day streak!`,
    data: {
      type: 'streak_milestone',
      streak: streakDays.toString(),
    },
  });
}
