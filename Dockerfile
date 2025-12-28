FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build the Vite app (creates dist/)
RUN npm run build

EXPOSE 8080

# Serve the production build
CMD ["npm", "start"]
]
