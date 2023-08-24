FROM node:latest
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 8002
CMD ["node", "server.js"]