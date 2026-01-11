FROM node:20-slim

WORKDIR /app

# Prisma requires OpenSSL
RUN apt-get update -y && apt-get install -y openssl

# Copy package.json first (for caching)
COPY package*.json ./
RUN npm install

# Copy full source INCLUDING prisma
COPY . .

# 🔥 THIS IS THE IMPORTANT LINE (YOU WERE MISSING THIS)
RUN npx prisma generate

# Build NestJS
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
