# Stage 1: Build Angular app
FROM node:18-alpine AS build

WORKDIR /app

# Copy only package files first (better caching)
COPY package*.json ./

# Use npm ci for deterministic, production-grade builds
RUN npm ci

# Copy the rest of your Angular source code
COPY . .

# Build the Angular app for production
RUN npm run build -- --configuration production


# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy build output to nginx html folder
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a health check (good for orchestration)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q --spider http://localhost/index.html || exit 1

# Expose port 80 for HTTP
EXPOSE 80

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]