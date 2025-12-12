# Combined Dockerfile - Build both frontend and backend
# Works when build context is repository root

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build -- --configuration production

# Stage 2: Build Backend
FROM node:20-alpine AS backend-builder

WORKDIR /backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npm run build

# Stage 3: Production
FROM node:20-alpine

WORKDIR /app

# Copy backend build and dependencies
COPY --from=backend-builder /backend/dist ./dist
COPY --from=backend-builder /backend/package*.json ./
COPY --from=backend-builder /backend/node_modules ./node_modules

# Copy frontend build to public folder (served by NestJS)
COPY --from=frontend-builder /frontend/dist/class-schedule/browser ./public

# Create necessary directories
RUN mkdir -p uploads/memes data

# Set production environment
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
