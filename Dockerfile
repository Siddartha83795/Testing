FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# BUILD with env vars
RUN npm run build

EXPOSE 8080

# Serve production build
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "8080"]
