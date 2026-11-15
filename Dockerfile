FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:20-alpine AS runtime

ENV NODE_ENV=production
ENV SERVE_CLIENT=true
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY backend/ ./backend/
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

EXPOSE 5000
CMD ["node", "backend/server.js"]
