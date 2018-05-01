FROM node:9

ARG PROXY_URL
RUN npm set registry ${PROXY_URL:-https://registry.npmjs.org/}

WORKDIR /moviewatcher/moviewatcher-server
ADD ./moviewatcher-server/package.json .
RUN npm install --production && rm package.json

ADD moviewatcher-server /moviewatcher/moviewatcher-server
ADD moviewatcher-ui /moviewatcher/moviewatcher-ui
RUN mkdir /moviewatcher/moviewatcher-server/data

EXPOSE 3000
CMD ["npm", "start"]