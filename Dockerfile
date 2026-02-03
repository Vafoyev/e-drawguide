FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine
WORKDIR /app
RUN apk add --no-cache tzdata
ENV TZ=Asia/Tashkent
COPY --from=builder /app/node_modules ./node_modules
COPY . .
RUN mkdir -p uploads/books uploads/covers uploads/videos uploads/thumbnails logs
EXPOSE 5000
CMD ["node", "src/server.js"]