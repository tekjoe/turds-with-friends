# PWA Icons Setup

## Required Icons

Your PWA needs the following icon sizes in the `/public` directory:

- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

## How to Generate Icons

### Option 1: Use an Online Tool (Easiest)
1. Go to https://www.pwabuilder.com/imageGenerator
2. Upload your logo/icon (recommend 512x512 or larger PNG)
3. Download the generated icons
4. Place them in the `/public` directory

### Option 2: Use a Desktop Tool
- **Windows/Mac/Linux**: Use [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator)
  ```bash
  npx pwa-asset-generator path/to/your-logo.png public/
  ```

### Option 3: Manual Resize
If you have an image editor:
1. Open your logo in Photoshop, GIMP, or similar
2. Resize to each dimension listed above
3. Export as PNG with transparency
4. Name according to the list above

## Current Status

You currently have `icon.png` in your public directory. This needs to be resized to the dimensions above.

## Apple Touch Icon (Optional but Recommended)

Also create:
- `apple-touch-icon.png` (180x180) - for iOS home screen

## Favicon (Optional)

- `favicon.ico` (32x32 and 16x16 multi-size) - for browser tabs
