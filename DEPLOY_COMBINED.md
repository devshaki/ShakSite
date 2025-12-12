# Combined Deployment Fix

## Problem
The domain `https://lobster-app-vfvxz.ondigitalocean.app` was showing a 404 error because only the backend was deployed without the frontend.

## ✅ Solution Applied
Configured a **combined deployment** where the backend serves both the API and the Angular frontend static files.

## Changes Made

### 1. Backend Configuration
- **`backend/src/main.ts`**: Added global `/api` prefix for all API routes
- **`backend/src/app.module.ts`**: Configured to serve frontend static files from root
- **All Controllers**: Removed `/api` prefix (now handled globally)

### 2. Dockerfile
- **`backend/Dockerfile`**: Now builds both frontend and backend in a single image
- Multi-stage build for optimization

### 3. DigitalOcean App Spec
- **`.do/app.yaml`**: Simplified to single web service serving everything

## Architecture

```
https://lobster-app-vfvxz.ondigitalocean.app
├── /                    → Angular Frontend (all routes)
├── /api/quotes          → Backend API
├── /api/exams           → Backend API
├── /api/tasks           → Backend API
├── /api/memes           → Backend API
└── /uploads/*           → Uploaded files
```

## 🚀 Deploy Now

### Step 1: Commit and Push
```bash
git add .
git commit -m "Fix: Configure combined frontend+backend deployment"
git push origin main
```

### Step 2: Redeploy in DigitalOcean

#### Option A: Automatic Redeploy
If auto-deploy is enabled, it will redeploy automatically from the push.

#### Option B: Manual Redeploy
1. Go to DigitalOcean Dashboard
2. Select your app (lobster-app-vfvxz)
3. Click "Settings" → "Redeploy"

### Step 3: Verify Deployment

**Check Frontend:**
```
Visit: https://lobster-app-vfvxz.ondigitalocean.app
Expected: Angular app loads
```

**Check API:**
```bash
curl https://lobster-app-vfvxz.ondigitalocean.app/api/quotes
Expected: JSON array of quotes
```

## 📋 Build Process

The Dockerfile now:
1. Builds Angular frontend (`npm run build` in frontend/)
2. Builds NestJS backend (`npm run build` in backend/)
3. Combines both in production image
4. Backend serves frontend files + API

## 🐛 Troubleshooting

### Build fails in DigitalOcean
- Check build logs for errors
- Ensure both `frontend/` and `backend/` have `package.json`
- Verify Dockerfile path is `backend/Dockerfile`
- Source directory should be `.` (root)

### Frontend loads but API fails
- Check browser console for CORS errors
- Verify API calls use `/api/` prefix
- Check environment.prod.ts has correct apiUrl

### 404 on specific routes
- Angular routing requires all routes to return index.html
- Backend is configured to serve index.html for non-API routes

## Environment Variables

Ensure these are set in DigitalOcean:
- `NODE_ENV=production`
- `PORT=3000`
- `FRONTEND_URL=https://lobster-app-vfvxz.ondigitalocean.app`

## Local Testing

To test the combined setup locally:

```bash
# Build frontend
cd frontend
npm install
npm run build -- --configuration production

# Build and run backend (will serve frontend)
cd ../backend
npm install
npm run build
npm run start:prod
```

Visit: http://localhost:3000

## 📝 Notes

- Frontend files are served from `/` (root)
- All API routes are under `/api/*`
- Uploaded files are under `/uploads/*`
- This is a monolithic deployment (easier for small apps)
- Data persists in the container's filesystem (consider adding volumes for production)

## Success Indicators ✅

1. `https://lobster-app-vfvxz.ondigitalocean.app` → Shows your Angular app
2. `https://lobster-app-vfvxz.ondigitalocean.app/api/quotes` → Returns JSON
3. No CORS errors in browser console
4. App functionality works as expected

---

After deploying, your app will be fully functional at:
**https://lobster-app-vfvxz.ondigitalocean.app** 🎉
