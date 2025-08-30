# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for caching
COPY package*.json tsconfig.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src

# Build TypeScript
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine

WORKDIR /app

# Copy built files and package.json
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "dist/index.js"]
