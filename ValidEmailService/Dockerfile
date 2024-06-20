FROM node:latest

WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

ENV NODE_ENV=production HUNTER_API_KEY=0e448f6c5ad7ec63ceea5249afc40d555a48af12

CMD ["npm", "start"]
