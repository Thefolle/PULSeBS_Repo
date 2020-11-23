FROM node:13.12.0-alpine

WORKDIR /app

COPY package*.json ./
COPY pulsebs.db ./

RUN npm install --silent

COPY . ./

EXPOSE 3001

CMD ["npm","start"]