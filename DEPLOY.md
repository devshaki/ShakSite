# Deployment Guide for DigitalOcean

## Prerequisites

- DigitalOcean account
- Domain name (optional but recommended)

## Deployment Options

### Option 1: DigitalOcean App Platform (Recommended - Easiest)

1. **Push code to GitHub**

   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create App on DigitalOcean**

   - Go to DigitalOcean App Platform
   - Click "Create App"
   - Connect your GitHub repository
   - Select the `ShakSite` repository

3. **Configure Backend Service**

   - Component Type: **Web Service**
   - Name: `shaksite-backend`
   - Source Directory: `/backend`
   - Build Command: `npm install && npm run build`
   - Run Command: `npm run start:prod`
   - HTTP Port: `3000`
   - Environment Variables:
     - `NODE_ENV`: `production`
     - `FRONTEND_URL`: `${APP_URL}` (will be set automatically)

4. **Configure Frontend Service**

   - Component Type: **Static Site**
   - Name: `shaksite-frontend`
   - Source Directory: `/frontend`
   - Build Command: `npm install && npm run build`
   - Output Directory: `dist/shak-site/browser`

5. **Configure Environment Variables**

   - In the frontend build settings, add:
     - Replace `environment.prod.ts` to use your backend URL
   - The backend URL will be: `https://shaksite-backend-xxxxx.ondigitalocean.app`

6. **Deploy**
   - Click "Create Resources"
   - Wait for deployment (5-10 minutes)

### Option 2: Droplet with Docker (More Control)

1. **Create Dockerfile for Backend**

   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "run", "start:prod"]
   ```

2. **Build Frontend Locally**

   ```bash
   cd frontend
   npm run build
   ```

3. **Upload to Droplet**
   - Create Ubuntu droplet
   - Install Node.js and nginx
   - Upload backend and built frontend
   - Configure nginx as reverse proxy

### Option 3: Simple Node Server (Current Setup)

If you want to serve both from one Node server:

1. **Update Backend to Serve Frontend**

   - Install `@nestjs/serve-static`
   - Configure to serve Angular dist folder
   - Backend serves API at `/api/*` and frontend at `/*`

2. **Deploy to DigitalOcean**
   - Create a single Web Service
   - Build both frontend and backend
   - Serve from one server

## After Deployment

1. **Update Environment Variables**

   - Set `FRONTEND_URL` to your actual domain
   - Update `environment.prod.ts` with your backend URL

2. **Test All Features**

   - [ ] Daily quotes display
   - [ ] Add/delete custom quotes
   - [ ] Add/edit/delete exams
   - [ ] Add/edit/delete tasks
   - [ ] Upload/delete memes
   - [ ] Meme gallery

3. **Set Up Monitoring**
   - Enable DigitalOcean monitoring
   - Set up alerts for downtime

## Important Notes

- Backend uses file storage (JSON files) - data persists in the app's filesystem
- Uploaded meme images are stored in `/uploads/memes/` directory
- Make sure to add `/backend/data/` and `/backend/uploads/` to persistent storage if needed
- For production, consider using a database instead of JSON files for better reliability

## Current Configuration

✅ **Ready for Deployment:**

- Frontend uses environment configuration for API URLs
- Backend supports dynamic PORT from environment
- CORS configured for production domains
- Services properly separated into frontend/ and backend/

⚠️ **Before Deploying:**

1. Update `FRONTEND_URL` in backend environment
2. Backend will be at: `https://your-backend-url.com`
3. Update frontend's `environment.prod.ts` if needed (currently uses `/api` which works when served together)
