# Stage 1: Build Frontend and install dependencies
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

RUN npm --prefix backend install --omit=dev
RUN npm --prefix frontend install

COPY backend ./backend
COPY frontend ./frontend

RUN npm --prefix frontend run build

# Stage 2: Minimal Production Image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY package.json ./
COPY backend ./backend
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/frontend/dist ./frontend/dist

EXPOSE 5000

CMD ["node", "backend/server.js"]
