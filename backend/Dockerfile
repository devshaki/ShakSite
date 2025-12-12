# Multi-stage build: Build frontend and backend together
FROM node:20-alpine AS builder

# Build Frontend
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build -- --configuration production

# Build Backend
WORKDIR /backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy backend build
COPY --from=builder /backend/dist ./dist
COPY --from=builder /backend/package*.json ./
COPY --from=builder /backend/node_modules ./node_modules

# Copy frontend build into backend structure
COPY --from=builder /frontend/dist/shak-site/browser ./frontend/dist/shak-site/browser

# Create uploads directory
RUN mkdir -p uploads/memes data

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
