-- Location comments table
CREATE TABLE location_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_log_id UUID NOT NULL REFERENCES location_logs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_location_comments_location ON location_comments(location_log_id);
CREATE INDEX idx_location_comments_user ON location_comments(user_id);

ALTER TABLE location_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view comments on visible locations"
  ON location_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert comments"
  ON location_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON location_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  reference_id TEXT,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);
