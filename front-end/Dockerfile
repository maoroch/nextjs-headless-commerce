FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "node -e \"const http = require('http'); const poll = () => { console.log('⏳ Waiting for WordPress API to be ready...'); http.get('http://wordpress/wp-json/', (res) => { if (res.statusCode === 200) { process.exit(0); } else { setTimeout(poll, 3000); } }).on('error', () => setTimeout(poll, 3000)); }; poll();\" && npm run build && npm run start"]