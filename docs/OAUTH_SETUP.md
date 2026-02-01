# OAuth Provider Setup Guide

This guide explains how to configure Google and Apple OAuth providers for Turds with Friends.

## Prerequisites

- A Supabase project (create one at https://supabase.com)
- Google Cloud Console access
- Apple Developer account ($99/year)

## 1. Get Your Supabase Callback URL

Your OAuth callback URL will be:
```
https://<your-project-ref>.supabase.co/auth/v1/callback
```

You can find your project ref in your Supabase dashboard URL or by running:
```bash
supabase projects list
```

## 2. Google OAuth Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Google+ API" (or "Google Identity Services")

### Step 2: Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in required fields:
   - App name: "Turds with Friends"
   - User support email: your email
   - Developer contact: your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users (if in testing mode)

### Step 3: Create OAuth Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application"
4. Add authorized redirect URI:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
5. Copy the Client ID and Client Secret

### Step 4: Configure in Supabase
1. Go to your Supabase dashboard
2. Navigate to Authentication > Providers
3. Enable Google
4. Paste your Client ID and Client Secret
5. Save

## 3. Apple Sign-In Setup

### Step 1: Apple Developer Setup
1. Go to [Apple Developer](https://developer.apple.com/)
2. Sign in with your Apple Developer account

### Step 2: Create App ID
1. Go to "Certificates, Identifiers & Profiles"
2. Click "Identifiers" > "+" 
3. Select "App IDs" > Continue
4. Select "App" > Continue
5. Enter description and Bundle ID
6. Enable "Sign in with Apple" capability
7. Click Continue > Register

### Step 3: Create Services ID
1. Go to "Identifiers" > "+"
2. Select "Services IDs" > Continue
3. Enter description and identifier (e.g., `com.yourcompany.turds-web`)
4. Click Continue > Register
5. Click on the newly created Services ID
6. Enable "Sign in with Apple"
7. Click Configure:
   - Primary App ID: Select your App ID
   - Domains: `<your-project-ref>.supabase.co`
   - Return URLs: `https://<your-project-ref>.supabase.co/auth/v1/callback`
8. Save

### Step 4: Create Private Key
1. Go to "Keys" > "+"
2. Enter a key name
3. Enable "Sign in with Apple"
4. Configure > Select your Primary App ID
5. Save > Continue > Register
6. Download the key (you can only download once!)
7. Note the Key ID

### Step 5: Configure in Supabase
1. Go to your Supabase dashboard
2. Navigate to Authentication > Providers
3. Enable Apple
4. Enter:
   - Services ID (from Step 3)
   - Team ID (from Apple Developer account membership)
   - Key ID (from Step 4)
   - Private Key (paste the contents of the .p8 file)
5. Save

## 4. Environment Variables

After setup, ensure your `.env.local` file has:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 5. Testing

1. Run your app locally: `npm run dev`
2. Click "Sign in with Google" or "Sign in with Apple"
3. Complete the OAuth flow
4. Verify user appears in Supabase Authentication > Users

## Troubleshooting

### "redirect_uri_mismatch" Error
- Verify the callback URL in your provider matches exactly
- Check for trailing slashes
- Ensure you're using HTTPS

### Apple Sign-In Not Working
- Verify your Services ID domain configuration
- Check that the private key is correctly pasted (including BEGIN/END lines)
- Ensure your app is using HTTPS (required for Apple Sign-In)

### User Created But No Profile
- Check that the `handle_new_user` trigger is enabled in your database
- Verify the trigger function exists: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
