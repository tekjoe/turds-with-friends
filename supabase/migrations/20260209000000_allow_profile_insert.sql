-- Allow users to insert their own profile
-- This is a fallback in case the handle_new_user trigger fails or for existing users

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
