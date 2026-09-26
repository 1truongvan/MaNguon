FROM node:20-alpine

WORKDIR /app

# Copy package.json trước để cài dependency
COPY package*.json ./

RUN npm install

# Copy toàn bộ source code
COPY . .

# Port backend (đổi nếu project dùng port khác)
EXPOSE 5000

ENV NODE_ENV=production

CMD ["npm", "start"]