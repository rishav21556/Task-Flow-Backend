FROM node:22-alpine
WORKDIR /backend

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]

