# Gunakan Node.js versi LTS
FROM node:22.20.0-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]

EXPOSE 3001

