# DigitalOcean Deployment Configuration

## Your Domain
Frontend URL: `https://lobster-app-vfvxz.ondigitalocean.app`

## ✅ Completed Configurations

### 1. Frontend Environment (Production)
**File:** `frontend/src/environments/environment.prod.ts`

```typescript
apiUrl: 'https://lobster-app-vfvxz.ondigitalocean.app/api'
```

This assumes your backend API is served from the same domain under the `/api` path.

### 2. Backend CORS Configuration
**File:** `backend/src/main.ts`

Updated to allow requests from:
- `https://lobster-app-vfvxz.ondigitalocean.app`
- Any custom `FRONTEND_URL` environment variable

## 🚀 Deployment Options

### Option A: Combined Deployment (Recommended)
Deploy both frontend and backend together, where:
- Frontend: `https://lobster-app-vfvxz.ondigitalocean.app`
- Backend API: `https://lobster-app-vfvxz.ondigitalocean.app/api`

**Current setup supports this!** ✅

### Option B: Separate Services
If your backend is deployed separately:

1. **Get your backend URL** (e.g., `https://backend-xxx.ondigitalocean.app`)

2. **Update frontend environment:**
   ```typescript
   // frontend/src/environments/environment.prod.ts
   apiUrl: 'https://YOUR-BACKEND-URL/api'
   ```

3. **Set FRONTEND_URL in backend:**
   In DigitalOcean App Platform → Backend Service → Environment Variables:
   ```
   FRONTEND_URL=https://lobster-app-vfvxz.ondigitalocean.app
   ```

## 📋 Deployment Checklist

### For DigitalOcean App Platform:

1. **Push Changes to GitHub:**
   ```bash
   git add .
   git commit -m "Configure for DigitalOcean deployment"
   git push origin main
   ```

2. **In DigitalOcean Dashboard:**
   - Go to your app (lobster-app-vfvxz)
   - Click "Settings" → "Redeploy"
   - Or trigger automatic redeployment from GitHub push

3. **Verify Environment Variables:**
   - Backend service should have:
     - `NODE_ENV=production`
     - `PORT=3000`
     - `FRONTEND_URL=https://lobster-app-vfvxz.ondigitalocean.app`

4. **Check Build Logs:**
   - Frontend should build successfully with Angular
   - Backend should start on port 3000

## 🔍 Testing After Deployment

### Test Backend API:
```bash
curl https://lobster-app-vfvxz.ondigitalocean.app/api/quotes
```

### Test Frontend:
Visit: `https://lobster-app-vfvxz.ondigitalocean.app`

### Check CORS:
Open browser DevTools → Network tab → Look for successful API calls without CORS errors

## 🐛 Troubleshooting

### Issue: API calls failing (CORS errors)
**Fix:** Verify FRONTEND_URL environment variable matches your domain exactly

### Issue: 404 on API routes
**Fix:** Ensure backend is routing `/api/*` correctly

### Issue: Frontend shows but no data loads
**Fix:** Check browser console for API errors and verify `environment.prod.ts` apiUrl

## 📝 Current Architecture

```
┌─────────────────────────────────────────┐
│  lobster-app-vfvxz.ondigitalocean.app  │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
    ┌───▼────┐         ┌───▼────┐
    │Frontend│         │Backend │
    │(Static)│         │ (API)  │
    │   /    │         │  /api  │
    └────────┘         └────────┘
```

## 🔄 Next Steps

1. Commit and push these changes
2. Redeploy your app in DigitalOcean
3. Test all functionality
4. Enjoy your live app! 🎉

## 📞 Need Help?

- Check DigitalOcean logs for errors
- Verify all environment variables are set
- Ensure both services are running
- Check CORS headers in browser Network tab
