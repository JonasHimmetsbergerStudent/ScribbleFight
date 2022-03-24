FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./p5_backend/package*.json ./p5_backend/

WORKDIR /usr/src/app/p5_backend
RUN npm install

# Bundle app source
WORKDIR /usr/src/app
COPY ./p5_backend ./p5_backend
COPY ./p5_frontend ./p5_frontend
COPY ./pixel_arrays ./pixel_arrays

EXPOSE 3000
CMD [ "node", "./p5_backend/server.js" ]