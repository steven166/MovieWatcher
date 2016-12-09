FROM node:6

ARG PROXY_URL
RUN npm set registry ${PROXY_URL:-https://registry.npmjs.org/}

WORKDIR /moviewatcher/moviewatcher-server
ADD ./moviewatcher-server/package.json .
RUN npm install --production

ADD moviewatcher-server /moviewatcher/moviewatcher-server
ADD moviewatcher-ui /moviewatcher/moviewatcher-ui

WORKDIR /moviewatcher/moviewatcher-server
EXPOSE 3000
CMD ["npm", "start"]