FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install -g npm@10.9.8 --unsafe-perm
RUN npm ci --omit=dev
COPY . .
EXPOSE 5000
CMD ["node", "src/server.js"]