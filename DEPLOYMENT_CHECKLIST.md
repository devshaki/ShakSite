# Quick Deployment Checklist for Persistent Storage

## Before You Deploy

- [ ] Code changes committed and pushed
- [ ] Volume created in DigitalOcean (10GB recommended)
- [ ] App spec updated with volume mount
- [ ] Environment variables configured (`DATA_DIR`, `UPLOADS_DIR`)

## After First Deployment with Volume

1. **Verify Volume Mount**
   ```bash
   # Access app console in DigitalOcean
   df -h
   # Should show /data mounted
   ```

2. **Check Environment Variables**
   ```bash
   echo $DATA_DIR
   echo $UPLOADS_DIR
   # Should show /data and /data/uploads
   ```

3. **Verify Data Files**
   ```bash
   ls -la /data/
   # Should show memes.json, quotes.json, exams.json, tasks.json
   ls -la /data/uploads/memes/
   ```

## Testing Data Persistence

1. Upload a meme or add a quote
2. Note the data
3. Trigger a new deployment (make a small code change)
4. After deployment, check if your data still exists
5. ✅ If data persists, setup is complete!

## If Data Still Resets

Check these common issues:

1. **Volume not mounted**
   - Go to App Settings → Components → web
   - Verify volume is attached
   - Check mount path is `/data`

2. **Environment variables not set**
   - Go to App Settings → Environment Variables
   - Verify `DATA_DIR=/data` and `UPLOADS_DIR=/data/uploads`

3. **Permissions issue**
   ```bash
   # In console
   chmod -R 755 /data
   chown -R node:node /data
   ```

4. **Init script not running**
   - Check deployment logs
   - Should see "Data directory initialized successfully"

## Updating App Spec via Console

1. Go to your app in DigitalOcean
2. Click **Settings**
3. Click **App Spec**
4. Add to your service:
   ```yaml
   envs:
   - key: DATA_DIR
     value: /data
   - key: UPLOADS_DIR
     value: /data/uploads
   
   volumes:
   - name: shaksite-data
     mount_path: /data
   ```
5. Add at root level:
   ```yaml
   volumes:
   - name: shaksite-data
     size_gigabytes: 10
   ```
6. Click **Save**

## Cost

- Volume (10GB): ~$1/month
- App instance: ~$5/month (basic-xxs)
- **Total**: ~$6/month

## Need Help?

See [DIGITALOCEAN_PERSISTENT_STORAGE.md](./DIGITALOCEAN_PERSISTENT_STORAGE.md) for detailed instructions.
