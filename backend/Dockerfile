# Backend Dockerfile - Works when backend is the build context
# Since DigitalOcean is using backend as source_dir, we need to adjust

FROM node:20-alpine AS backend-builder

WORKDIR /app

# Copy backend files
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy backend build and dependencies
COPY --from=backend-builder /app/dist ./dist
COPY --from=backend-builder /app/package*.json ./
COPY --from=backend-builder /app/node_modules ./node_modules

# Create necessary directories
RUN mkdir -p uploads/memes data

# Note: Frontend static files would need to be added separately
# For now, this serves API only at /api routes

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
