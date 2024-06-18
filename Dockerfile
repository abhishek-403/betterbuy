FROM ghcr.io/puppeteer/puppeteer:20.11.1

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY . .
RUN npm install --production
RUN npm run build

CMD ["npm", "start"]