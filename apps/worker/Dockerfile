FROM node:20-slim

# 🔥 Install OpenSSL (REQUIRED for Prisma)
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npm run prisma:generate

COPY . .
RUN npm run build

CMD ["node", "dist/main.js"]
