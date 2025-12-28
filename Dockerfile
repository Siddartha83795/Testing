FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# 🔴 THIS IS WHERE VITE READS .env.production
RUN npm run build

EXPOSE 8080

# 🔴 This serves the built app
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "8080"]
