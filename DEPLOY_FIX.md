# Quick Deployment Fix

Your deployment failed because it tried to build from the root directory. Here's what was fixed:

## ✅ Fixed Issues

1. **Removed root package.json** - Was causing buildpack to detect wrong directory
2. **Created `.do/app.yaml`** - DigitalOcean app configuration
3. **Configured environment** - Backend URL set for production

## 🚀 Deploy Now

### Option 1: Use App Spec (Recommended)

1. In DigitalOcean App Platform dashboard:
   - Go to your app settings
   - Click "Import App Spec"
   - Upload `.do/app.yaml`
   - Click "Update"

2. After deployment completes:
   - Copy your backend URL (will be like `shaksite-backend-xxxxx.ondigitalocean.app`)
   - Update `frontend/src/environments/environment.prod.ts` line 3 with your actual backend URL
   - Commit and push - it will redeploy automatically

### Option 2: Manual Configuration

**Backend Component:**
- Type: Web Service
- Source Directory: `backend`
- Build Command: `npm install && npm run build`
- Run Command: `npm run start:prod`
- Port: 3000

**Frontend Component:**
- Type: Static Site  
- Source Directory: `frontend`
- Build Command: `npm install && npm run build -- --configuration production`
- Output Directory: `dist/shak-site/browser`

## 📝 After First Deploy

1. Get your backend URL from DigitalOcean
2. Update this line in `frontend/src/environments/environment.prod.ts`:
   ```typescript
   apiUrl: 'https://YOUR-ACTUAL-BACKEND-URL/api'
   ```
3. Commit and push to redeploy

## 🔧 CORS Configuration

The backend is configured to accept requests from your frontend URL. Make sure:
- Backend env variable `FRONTEND_URL` is set to your frontend domain
- Or update `backend/src/main.ts` with your frontend URL

That's it! Your app should now deploy successfully.
