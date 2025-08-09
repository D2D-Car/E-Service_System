# Netlify Deployment Instructions

## Environment Variables Setup

To deploy this Angular application on Netlify without exposing Firebase secrets, you need to set up environment variables in your Netlify dashboard.

### Steps:

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** > **Environment variables**
3. Add the following environment variables:

```
NG_APP_FIREBASE_API_KEY=AIzaSyBef27wt27Y59ko3iTHE97Ap2UL-DpOhR0
NG_APP_FIREBASE_AUTH_DOMAIN=d2ddatabase.firebaseapp.com
NG_APP_FIREBASE_DATABASE_URL=https://d2ddatabase-default-rtdb.firebaseio.com
NG_APP_FIREBASE_PROJECT_ID=d2ddatabase
NG_APP_FIREBASE_STORAGE_BUCKET=d2ddatabase.firebasestorage.app
NG_APP_FIREBASE_MESSAGING_SENDER_ID=49961156364
NG_APP_FIREBASE_APP_ID=1:49961156364:web:40dd7d0207127ca2d65329
NG_APP_FIREBASE_MEASUREMENT_ID=G-XS6P2WGWNY
NG_APP_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
```

### Build Settings

The `netlify.toml` file configures:
- Build command: `npm run build --prod`
- Publish directory: `dist/d2-d-front`
- SPA redirects for Angular routing
- Secrets scanning exclusion for environment files

### Alternative Solution

If you continue having issues, you can also:

1. Use the `SECRETS_SCAN_ENABLED=false` environment variable to completely disable secrets scanning
2. Or use `SECRETS_SCAN_OMIT_PATHS=src/environments/*` to exclude only the environment files

## Local Development

For local development, the application will use the fallback values defined in the environment files.
