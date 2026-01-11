FROM node:20-slim

WORKDIR /app

# Prisma needs OpenSSL
RUN apt-get update -y && apt-get install -y openssl

# Install deps
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build NestJS
RUN npm run build

# Generate Prisma + run app at runtime
CMD sh -c "npx prisma generate && node dist/main.js"
