FROM node:latest

WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3003

ENV NODE_ENV=production EMAIL_USER=yasirghaffar.nust@gmail.com EMAIL_PASS=dwphkpbxnlahgsph

CMD ["npm", "start"]