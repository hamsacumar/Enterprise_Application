# ============================================
# Stage 1: Build Angular app
# ============================================
FROM node:18 AS build
WORKDIR /app

# Copy only package files first (better cache & avoids cross-platform issues)
COPY package*.json ./

# Install dependencies inside the container
# "npm ci" is safer for production builds than "npm install"
RUN npm ci

# Copy the rest of your Angular source code
COPY . .

# Build the Angular app for production
RUN npm run build --prod


# ============================================
# Stage 2: Serve with Nginx
# ============================================
FROM nginx:alpine

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy build output to nginx html folder
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copy custom nginx configuration if you have one
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for HTTP
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]





