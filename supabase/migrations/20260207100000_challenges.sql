-- Enums
CREATE TYPE challenge_type AS ENUM ('most_logs', 'longest_streak', 'most_weight_lost');
CREATE TYPE challenge_status AS ENUM ('pending', 'active', 'completed');
CREATE TYPE participant_status AS ENUM ('invited', 'accepted', 'declined');

-- Challenges table
CREATE TABLE challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  challenge_type challenge_type NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status challenge_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Challenge participants table
CREATE TABLE challenge_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0,
  status participant_status NOT NULL DEFAULT 'invited',
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (challenge_id, user_id)
);

-- Indexes
CREATE INDEX idx_challenges_creator ON challenges(creator_id);
CREATE INDEX idx_challenges_status ON challenges(status);
CREATE INDEX idx_challenge_participants_challenge ON challenge_participants(challenge_id);
CREATE INDEX idx_challenge_participants_user ON challenge_participants(user_id);

-- Trigger for updated_at
CREATE TRIGGER set_challenges_updated_at
  BEFORE UPDATE ON challenges
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;

-- Challenges: users can see challenges they created or participate in
CREATE POLICY "Users can view their challenges"
  ON challenges FOR SELECT
  USING (
    creator_id = auth.uid()
    OR id IN (
      SELECT challenge_id FROM challenge_participants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create challenges"
  ON challenges FOR INSERT
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Creators can update their challenges"
  ON challenges FOR UPDATE
  USING (creator_id = auth.uid());

-- Challenge participants: users can see participants of their challenges
CREATE POLICY "Users can view participants of their challenges"
  ON challenge_participants FOR SELECT
  USING (
    challenge_id IN (
      SELECT id FROM challenges
      WHERE creator_id = auth.uid()
      OR id IN (SELECT challenge_id FROM challenge_participants WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Challenge creators can invite participants"
  ON challenge_participants FOR INSERT
  WITH CHECK (
    challenge_id IN (
      SELECT id FROM challenges WHERE creator_id = auth.uid()
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "Users can update their own participation"
  ON challenge_participants FOR UPDATE
  USING (user_id = auth.uid());
