FROM ghcr.io/puppeteer/puppeteer:19.7.2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
    
RUN mkdir /usr/src/app && chown node:node /usr/src/app
WORKDIR /usr/src/app
USER node
COPY --chown=node:node package.json package-lock.json* ./
COPY --chown=node:node . .
RUN npm install --force
RUN npm run build
EXPOSE 3000
CMD ["npm", "run","start"]