-- Use built-in gen_random_uuid() function (available in Postgres 13+)

-- Create custom types
CREATE TYPE friendship_status AS ENUM ('pending', 'accepted', 'blocked');
CREATE TYPE weight_unit AS ENUM ('lbs', 'kg');

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  xp_total INTEGER DEFAULT 0 NOT NULL,
  current_streak INTEGER DEFAULT 0 NOT NULL,
  longest_streak INTEGER DEFAULT 0 NOT NULL,
  privacy_settings JSONB DEFAULT '{"show_weight": false, "show_logs_to_friends": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT username_format CHECK (username ~* '^[a-zA-Z0-9_]+$')
);

-- Movement logs table
CREATE TABLE movement_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  bristol_type INTEGER NOT NULL CHECK (bristol_type >= 1 AND bristol_type <= 7),
  pre_weight DECIMAL(5,1),
  post_weight DECIMAL(5,1),
  weight_unit weight_unit DEFAULT 'lbs' NOT NULL,
  logged_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  xp_earned INTEGER DEFAULT 50 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Friendships table
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  addressee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status friendship_status DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT different_users CHECK (requester_id != addressee_id),
  CONSTRAINT unique_friendship UNIQUE (requester_id, addressee_id)
);

-- Badges table
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  criteria JSONB,
  icon_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- User badges (junction table)
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT unique_user_badge UNIQUE (user_id, badge_id)
);

-- Audit logs table for security tracking
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_movement_logs_user_id ON movement_logs(user_id);
CREATE INDEX idx_movement_logs_logged_at ON movement_logs(logged_at DESC);
CREATE INDEX idx_friendships_requester ON friendships(requester_id);
CREATE INDEX idx_friendships_addressee ON friendships(addressee_id);
CREATE INDEX idx_friendships_status ON friendships(status);
CREATE INDEX idx_user_badges_user ON user_badges(user_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX idx_profiles_username ON profiles(username);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_friendships_updated_at
  BEFORE UPDATE ON friendships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function to calculate and update streak
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
  last_log_date DATE;
  current_date_val DATE := CURRENT_DATE;
BEGIN
  -- Get the last log date for this user (excluding the new entry)
  SELECT DATE(logged_at) INTO last_log_date
  FROM movement_logs
  WHERE user_id = NEW.user_id AND id != NEW.id
  ORDER BY logged_at DESC
  LIMIT 1;
  
  -- Update the profile
  IF last_log_date IS NULL THEN
    -- First log ever
    UPDATE profiles 
    SET current_streak = 1,
        longest_streak = GREATEST(longest_streak, 1),
        xp_total = xp_total + NEW.xp_earned
    WHERE id = NEW.user_id;
  ELSIF last_log_date = current_date_val - INTERVAL '1 day' THEN
    -- Consecutive day - increment streak
    UPDATE profiles 
    SET current_streak = current_streak + 1,
        longest_streak = GREATEST(longest_streak, current_streak + 1),
        xp_total = xp_total + NEW.xp_earned
    WHERE id = NEW.user_id;
  ELSIF last_log_date = current_date_val THEN
    -- Same day - just add XP, don't change streak
    UPDATE profiles 
    SET xp_total = xp_total + NEW.xp_earned
    WHERE id = NEW.user_id;
  ELSE
    -- Streak broken - reset to 1
    UPDATE profiles 
    SET current_streak = 1,
        xp_total = xp_total + NEW.xp_earned
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update streak on new log
CREATE TRIGGER on_movement_log_created
  AFTER INSERT ON movement_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_user_streak();

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE movement_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can view friend profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM friendships
      WHERE status = 'accepted'
      AND (
        (requester_id = auth.uid() AND addressee_id = profiles.id) OR
        (addressee_id = auth.uid() AND requester_id = profiles.id)
      )
    )
  );

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Movement logs policies
CREATE POLICY "Users can view their own logs"
  ON movement_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view friend logs if allowed"
  ON movement_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM friendships f
      JOIN profiles p ON p.id = movement_logs.user_id
      WHERE f.status = 'accepted'
      AND (
        (f.requester_id = auth.uid() AND f.addressee_id = movement_logs.user_id) OR
        (f.addressee_id = auth.uid() AND f.requester_id = movement_logs.user_id)
      )
      AND (p.privacy_settings->>'show_logs_to_friends')::boolean = true
    )
  );

CREATE POLICY "Users can insert their own logs"
  ON movement_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own logs"
  ON movement_logs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own logs"
  ON movement_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Friendships policies
CREATE POLICY "Users can view their friendships"
  ON friendships FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE POLICY "Users can send friend requests"
  ON friendships FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update friendships they're part of"
  ON friendships FOR UPDATE
  USING (auth.uid() = requester_id OR auth.uid() = addressee_id)
  WITH CHECK (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE POLICY "Users can delete their friendships"
  ON friendships FOR DELETE
  USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- Badges policies (public read)
CREATE POLICY "Anyone can view badges"
  ON badges FOR SELECT
  USING (true);

-- User badges policies
CREATE POLICY "Users can view their own badges"
  ON user_badges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view friend badges"
  ON user_badges FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM friendships
      WHERE status = 'accepted'
      AND (
        (requester_id = auth.uid() AND addressee_id = user_badges.user_id) OR
        (addressee_id = auth.uid() AND requester_id = user_badges.user_id)
      )
    )
  );

-- Audit logs policies (users can only view their own)
CREATE POLICY "Users can view their own audit logs"
  ON audit_logs FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- SEED DATA: Default badges
-- ============================================

INSERT INTO badges (name, description, criteria, icon_url) VALUES
  ('First Log', 'Logged your first bowel movement', '{"type": "first_log"}', null),
  ('7 Day Streak', 'Maintained a 7-day logging streak', '{"type": "streak", "days": 7}', null),
  ('14 Day Streak', 'Maintained a 14-day logging streak', '{"type": "streak", "days": 14}', null),
  ('30 Day Streak', 'Maintained a 30-day logging streak', '{"type": "streak", "days": 30}', null),
  ('Fiber King', 'Logged 10 Type 3 or Type 4 stools', '{"type": "ideal_count", "count": 10}', null),
  ('Golden Fiber', 'Invited 3 friends to the app', '{"type": "friend_invites", "count": 3}', null),
  ('Century Club', 'Logged 100 movements', '{"type": "total_logs", "count": 100}', null),
  ('Perfect Week', 'Logged ideal stools (Type 3-4) for 7 consecutive days', '{"type": "ideal_streak", "days": 7}', null),
  ('Social Butterfly', 'Added 10 friends', '{"type": "friend_count", "count": 10}', null),
  ('Health Champion', 'Reached 10,000 XP', '{"type": "xp_milestone", "xp": 10000}', null);
