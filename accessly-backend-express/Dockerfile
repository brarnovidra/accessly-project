FROM node:22.19.0-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install 

COPY . .

EXPOSE 3000
CMD ["sh", "-c", "npm run db:create && npm run db:migrate && npm run db:seeds && npm start"]
