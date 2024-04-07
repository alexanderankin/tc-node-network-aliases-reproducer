FROM node:20-alpine@sha256:7e227295e96f5b00aa79555ae166f50610940d888fc2e321cf36304cbd17d7d6
COPY package.json .
COPY package-lock.json .
RUN npm ci
WORKDIR /app
COPY service.js .
CMD ["node", "service.js"]
EXPOSE 3000
