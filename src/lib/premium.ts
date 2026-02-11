/**
 * Premium access check - currently OPEN for all users
 * 
 * This module intentionally grants universal premium access.
 * To re-enable premium checks, uncomment the ORIGINAL IMPLEMENTATION
 * block below and remove the current return statement.
 * 
 * ORIGINAL IMPLEMENTATION (preserve for future reference):
 * --------------------------------------------------------
 * import { createAdminClient } from "@/lib/supabase/server";
 * 
 * export async function isPremium(userId: string): Promise<boolean> {
 *   const admin = createAdminClient();
 *   const { data } = await admin
 *     .from("subscriptions")
 *     .select("id")
 *     .eq("user_id", userId)
 *     .eq("status", "active")
 *     .gt("current_period_end", new Date().toISOString())
 *     .limit(1)
 *     .maybeSingle();
 * 
 *   return !!data;
 * }
 * --------------------------------------------------------
 */

/**
 * Check if a user has premium access
 * @param userId - The user's ID (unused, but kept for API compatibility)
 * @returns Promise<boolean> - Always returns true (universal premium access)
 */
export async function isPremium(_userId: string): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void _userId; // Parameter kept for API compatibility
  // See the comment at the top of this file for the original implementation
  return true;
}
