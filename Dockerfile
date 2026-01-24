FROM node:20-alpine

WORKDIR /usr/src/app

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

RUN npm install 

COPY . .

ENV PORT=5000
ENV NODE_ENV=production


RUN npx prisma generate  
RUN npm run build

CMD ["sh", "-c", "npm run migrate && npm run start"]
