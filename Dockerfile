FROM gcr.io/google-appengine/nodejs
COPY . /app/
RUN cd /app && npm install
CMD ["node", "/app/server.js"]