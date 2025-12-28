FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build the Vite app
RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]
