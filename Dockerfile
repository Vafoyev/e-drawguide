FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

FROM node:18-alpine
RUN apk add --no-cache tzdata
ENV TZ=Asia/Tashkent
WORKDIR /app
COPY --from=builder /app ./
RUN mkdir -p logs uploads/books uploads/covers uploads/videos uploads/thumbnails && \
    chown -R node:node /app
USER node
VOLUME ["/app/uploads", "/app/logs"]
EXPOSE 4001
CMD ["npm", "start"]