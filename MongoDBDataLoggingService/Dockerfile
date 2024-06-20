FROM node:latest

WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3002

ENV NODE_ENV=production MONGO_URI=mongodb+srv://mghaffarbese21seecs:yasir0027@customformdatalogs.xlcrpaa.mongodb.net/?retryWrites=true&w=majority&appName=CustomFormDataLogs

CMD ["npm", "start"]
