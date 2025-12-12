# Frontend Dockerfile (for serving static files)
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build -- --configuration production

# Use nginx to serve static files
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/dist/shak-site/browser /usr/share/nginx/html

# Copy nginx configuration if needed
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
