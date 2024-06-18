FROM ghcr.io/puppeteer/puppeteer:19.7.2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app
USER node
COPY --chown=node:node package.json package-lock.json* ./
RUN npm install 
COPY --chown=node:node . .

EXPOSE 3000
CMD ["npm", "run","start"]