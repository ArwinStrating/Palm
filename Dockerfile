FROM gcr.io/google-appengine/nodejs
COPY . /app/
WORKDIR /app
RUN npm install -g typescript
RUN npm install
RUN sh -c tsc
CMD ["node", "/app/lib/server.js"]