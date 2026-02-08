# Deploying to Cloudflare Workers

This guide covers deploying the Next.js app to Cloudflare Workers using OpenNext.

## Prerequisites

1. A Cloudflare account (free tier works fine)
2. Wrangler CLI installed (already in devDependencies)

## Setup

### 1. Authenticate with Cloudflare

```bash
npx wrangler login
```

This will open a browser window to authorize Wrangler with your Cloudflare account.

### 2. Set Environment Variables

Cloudflare Workers use a different approach for environment variables. You need to set them using Wrangler:

```bash
# Supabase
npx wrangler secret put NEXT_PUBLIC_SUPABASE_URL
npx wrangler secret put NEXT_PUBLIC_SUPABASE_ANON_KEY
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY

# Stripe
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
npx wrangler secret put NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

For each command, you'll be prompted to enter the value interactively.

### 3. Update wrangler.json (Optional)

If you want to customize the worker name or other settings, edit `wrangler.json`:

```json
{
  "name": "your-custom-name",
  ...
}
```

## Development

### Local Development with Wrangler

To test the Cloudflare Worker build locally:

```bash
npm run preview
```

This builds the worker and starts a local dev server on port 8787.

### Build Only

```bash
npm run build:worker
```

## Deployment

### Deploy to Production

```bash
npm run deploy
```

This command:
1. Builds the worker using OpenNext
2. Deploys to Cloudflare Workers

### Deploy with Custom Domain

After deploying the worker, you need to add your custom domain via the Cloudflare Dashboard:

1. Deploy first: `npm run deploy`
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages**
3. Select your **bowel-buddies** worker
4. Click **Triggers** tab
5. Click **Add Custom Domain**
6. Enter `bowelbuddies.com` and click **Add Custom Domain**
7. (Optional) Repeat for `www.bowelbuddies.com`

**Note:** Since you purchased the domain through Cloudflare, DNS is automatically managed. The custom domain should work within a few minutes.

**Alternative:** Use Wrangler CLI to add the domain:
```bash
npx wrangler deploy
npx wrangler trigger create --name bowel-buddies --url bowelbuddies.com
```

## Important Notes

### Image Optimization

Images are configured with `unoptimized: true` in `next.config.ts` because Cloudflare Workers don't support Next.js Image Optimization API. For production, consider using Cloudflare Images or another image CDN.

### Environment Variables

- **Public env vars** (NEXT_PUBLIC_*): Must be set in `wrangler.json` under `vars`
- **Private secrets**: Must be set using `wrangler secret put`

### Known Limitations

- Some Next.js features may behave differently on Cloudflare Workers vs Vercel
- The app uses `nodejs_compat` flag for Node.js API compatibility
- File system operations don't work in Workers (use R2 or KV for storage)

## Troubleshooting

### Build Errors

If you see errors during build:
```bash
rm -rf .open-next .next
npm run build:worker
```

### Runtime Errors

Check logs with:
```bash
npx wrangler tail
```

### Memory/Timeout Issues

Cloudflare Workers have limits:
- 128MB memory (free tier) / 1GB (paid)
- 50ms CPU time (free tier) / 30s (paid)

If you hit these, consider:
- Optimizing your code
- Using Cloudflare Workers Paid plan ($5/month)
- Splitting heavy operations into separate functions

## Resources

- [OpenNext Cloudflare Docs](https://opennext.js.org/cloudflare)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
