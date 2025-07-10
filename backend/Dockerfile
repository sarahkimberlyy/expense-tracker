# Use lightweight Node.js 20 base image
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose backend port for API
EXPOSE 3001

# Start the backend server
CMD ["npm", "start"]
