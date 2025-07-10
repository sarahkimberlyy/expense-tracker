# --- Build Stage ---
# Use lightweight Node.js image to build the React (Vite) frontend
FROM node:20-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy dependency files first for caching purposes
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the production-ready frontend (output goes to /app/dist)
RUN npm run build

# --- Serve Stage ---
# Use Nginx to serve the built static files
FROM nginx:alpine

# Copy built files from previous stage to Nginx’s default public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace default Nginx config with custom config for routing and API proxying
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to allow web traffic
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]