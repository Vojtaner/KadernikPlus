# ===== STAGE 1: Build =====
FROM node:23-bullseye-slim as build
WORKDIR /app

# Declare build arguments
ARG VITE_ENABLE_MOCKS
ARG VITE_IS_DEVELOPMENT
ARG VITE_PORT

# Set environment variables for Vite to read at build time
ENV VITE_ENABLE_MOCKS=$VITE_ENABLE_MOCKS
ENV VITE_IS_DEVELOPMENT=$VITE_IS_DEVELOPMENT
ENV VITE_PORT=$VITE_PORT

# Install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy the rest of the frontend app
COPY frontend .

COPY entities/ ../entities/

# Build Vite app
RUN npm run build

# ===== STAGE 2: Serve =====
FROM node:23-bullseye-slim
WORKDIR /app

# Install a simple static server
RUN npm install -g serve

# Copy build output from previous stage
COPY --from=build /app/dist ./dist

# Set container port
ENV PORT=8083

# Start server
CMD ["serve", "-s", "dist", "-l", "8083"]
