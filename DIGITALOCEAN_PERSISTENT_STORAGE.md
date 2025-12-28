# DigitalOcean Persistent Storage Setup

## Problem
When deploying to DigitalOcean App Platform, all data (memes, quotes, exams, tasks) gets reset on every deployment because the data is stored in the container's filesystem, which is ephemeral.

## Solution
Use DigitalOcean Volumes to persist data across deployments.

---

## Step 1: Create a Volume in DigitalOcean

1. Go to your DigitalOcean Dashboard
2. Navigate to **Volumes** in the left sidebar
3. Click **Create Volume**
4. Configure:
   - **Name**: `shaksite-data`
   - **Size**: 10 GB (adjust as needed)
   - **Region**: Same region as your app
5. Click **Create Volume**

---

## Step 2: Update App Spec to Mount the Volume

### Option A: Via DigitalOcean Console

1. Go to your App in the App Platform
2. Click **Settings** → **App Spec**
3. Add environment variables and volumes to your service:

```yaml
services:
- name: web
  # ... existing configuration ...
  
  envs:
  - key: DATA_DIR
    value: /data
  - key: UPLOADS_DIR
    value: /data/uploads
  
  # Add volume mount
  volumes:
  - name: shaksite-data
    mount_path: /data
```

### Option B: Via doctl CLI

```bash
# Get your app ID
doctl apps list

# Update app spec
doctl apps update YOUR_APP_ID --spec app-spec.yaml
```

---

## Step 3: Create App Spec File (if using CLI)

Create a file named `app-spec.yaml`:

```yaml
name: shaksite
region: nyc
services:
- name: web
  dockerfile_path: backend/Dockerfile
  github:
    repo: YOUR_USERNAME/ShakSite
    branch: main
    deploy_on_push: true
  
  http_port: 3000
  
  environment_slug: node-js
  
  instance_count: 1
  instance_size_slug: basic-xxs
  
  # Environment variables for persistent storage
  envs:
  - key: DATA_DIR
    value: /data
  - key: UPLOADS_DIR
    value: /data/uploads
  - key: NODE_ENV
    value: production
  
  # Mount the volume
  volumes:
  - name: shaksite-data
    mount_path: /data
  
  routes:
  - path: /

# Define the volume
volumes:
- name: shaksite-data
  size_gigabytes: 10
```

---

## Step 4: Initialize Data Structure (One-Time Setup)

After deployment with volumes, you need to initialize the directory structure once:

### Option 1: Using Console Access

1. Go to your app in DigitalOcean
2. Navigate to **Console** tab
3. Run these commands:

```bash
mkdir -p /data/uploads/memes
touch /data/memes.json
touch /data/quotes.json
touch /data/exams.json
touch /data/tasks.json

# Initialize with empty arrays
echo "[]" > /data/memes.json
echo "[]" > /data/quotes.json
echo "[]" > /data/exams.json
echo "[]" > /data/tasks.json

# Set permissions
chmod -R 755 /data
```

### Option 2: Using Init Script

Add an init script to your Dockerfile:

```dockerfile
# Add before CMD
COPY backend/init-data.sh /app/init-data.sh
RUN chmod +x /app/init-data.sh
CMD ["/bin/sh", "-c", "/app/init-data.sh && node dist/main"]
```

Create `backend/init-data.sh`:

```bash
#!/bin/sh

# Initialize data directory if it doesn't exist
if [ ! -d "$DATA_DIR" ]; then
    mkdir -p $DATA_DIR/uploads/memes
fi

# Initialize JSON files if they don't exist
for file in memes quotes exams tasks; do
    if [ ! -f "$DATA_DIR/${file}.json" ]; then
        echo "[]" > "$DATA_DIR/${file}.json"
    fi
done

echo "Data directory initialized"
```

---

## Step 5: Deploy Changes

```bash
git add .
git commit -m "Add persistent storage support"
git push origin main
```

DigitalOcean will automatically redeploy your app.

---

## Verification

After deployment, verify the setup:

1. Upload a meme or add a quote
2. Trigger a new deployment (push a small change)
3. Check if the data persists

---

## Alternative: Use a Database

For better scalability and reliability, consider migrating to a database:

### Option 1: DigitalOcean Managed PostgreSQL

```yaml
databases:
- name: shaksite-db
  engine: PG
  production: true
  version: "15"
```

### Option 2: DigitalOcean Managed MongoDB

```yaml
databases:
- name: shaksite-db
  engine: MONGODB
  production: true
  version: "6"
```

Then update your backend to use the database instead of JSON files.

---

## Backup Strategy

### Manual Backup

```bash
# SSH into your app container
doctl apps exec YOUR_APP_ID --component web

# Create backup
tar -czf backup-$(date +%Y%m%d).tar.gz /data

# Copy backup out (you'll need to set up transfer method)
```

### Automated Backup (Recommended)

Use DigitalOcean Spaces + cron job:

```bash
# Add to your app
npm install aws-sdk

# Create backup script
node backup-to-spaces.js
```

---

## Troubleshooting

### Data Still Resets
- Verify volume is mounted: `df -h` in console
- Check environment variables: `echo $DATA_DIR`
- Verify file permissions: `ls -la /data`

### Upload Failures
- Check directory permissions: `chmod -R 755 /data/uploads`
- Verify disk space: `df -h /data`

### Performance Issues
- Increase volume size if needed
- Consider database migration for better performance

---

## Cost Estimation

- Volume Storage: $0.10/GB/month
- 10GB Volume: ~$1/month
- Basic XXS Instance: ~$5/month
- **Total**: ~$6/month

---

## Migration Path to Database

When ready to scale, follow these steps:

1. Export existing JSON data
2. Set up managed database
3. Update services to use database
4. Import data
5. Test thoroughly
6. Remove volume dependency

See `DATABASE_MIGRATION.md` for detailed instructions.
