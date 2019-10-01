FROM node:10.15.3-alpine

WORKDIR /myapp

RUN apk update && npm install -g npm

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "serve"]

