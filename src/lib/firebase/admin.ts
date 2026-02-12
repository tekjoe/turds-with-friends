/**
 * Firebase Cloud Messaging via REST API
 * This is a lightweight alternative to firebase-admin for Cloudflare Workers
 */

interface FCMMessage {
  token: string;
  notification?: {
    title: string;
    body: string;
  };
  data?: Record<string, string>;
  webpush?: {
    notification?: {
      icon?: string;
      badge?: string;
    };
  };
}

interface FCMResponse {
  name?: string;
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

/**
 * Get OAuth2 access token for Firebase
 */
async function getAccessToken(): Promise<string> {
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL!;

  // Create JWT for service account authentication
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const payload = {
    iss: clientEmail,
    sub: clientEmail,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
  };

  // Import jose for JWT signing
  const { SignJWT, importPKCS8 } = await import('jose');

  const privateKeyObj = await importPKCS8(privateKey, 'RS256');
  const jwt = await new SignJWT(payload)
    .setProtectedHeader(header)
    .sign(privateKeyObj);

  // Exchange JWT for access token
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const data = await response.json() as { access_token: string };
  return data.access_token;
}

/**
 * Send a message via Firebase Cloud Messaging REST API
 */
export async function sendMessage(message: FCMMessage): Promise<string> {
  const projectId = process.env.FIREBASE_PROJECT_ID!;
  const accessToken = await getAccessToken();

  const response = await fetch(
    `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ message }),
    }
  );

  const data = await response.json() as FCMResponse;

  if (data.error) {
    throw new Error(`FCM Error: ${data.error.message}`);
  }

  return data.name || '';
}

// Export a messaging object with similar API to firebase-admin
export const messaging = {
  send: sendMessage,
};
