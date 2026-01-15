# Multi-stage Dockerfile for NestJS backend in Yarn monorepo

# Stage 1: Dependencies
FROM node:24-alpine AS deps
WORKDIR /app

# Copy root package files for monorepo
COPY package.json yarn.lock ./
COPY apps/backend/package.json ./apps/backend/

# Install dependencies
RUN corepack enable && \
    corepack prepare yarn@stable --activate && \
    yarn install --frozen-lockfile

# Stage 2: Builder
FROM node:24-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules

# Copy source code
COPY . .

# Generate Prisma Client and build
WORKDIR /app/apps/backend
RUN npx prisma generate && \
    yarn build

# Stage 3: Runner
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma
COPY --from=builder /app/apps/backend/package.json ./apps/backend/

# Create uploads directory
RUN mkdir -p /app/apps/backend/uploads

WORKDIR /app/apps/backend

# Expose port
EXPOSE 4000

# Run migrations and start
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
