# Backend Dockerfile - API only
# For DigitalOcean App Platform with separate frontend static site

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

# Expose port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

# Start the application
CMD ["npm", "run", "start:prod"]
