# Build stage
FROM node:20-alpine AS builder

# Install dependencies only when needed
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci && \
    npm cache clean --force

# Copy source code
COPY . .

# Set environment variables for build
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WS_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

# Install runtime dependencies
RUN apk add --no-cache \
    dumb-init \
    curl \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy package.json for version info
COPY --from=builder /app/package.json ./package.json

# Set correct permissions
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "server.js"]