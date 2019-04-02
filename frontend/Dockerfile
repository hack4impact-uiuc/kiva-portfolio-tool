# A multi-stage docker build https://docs.docker.com/develop/develop-images/multistage-build/

# build react static files
FROM node:10.8.0 as build-stage

WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/

# build static files and makes a folder /app/build
RUN npm run build 

# nginx container that will run whenever you do `docker run [image name]`
FROM nginx:1.15
# copies the react built files from the previous container to this container for nginx to serve
COPY --from=build-stage /app/build/ /usr/share/nginx/html

# copy nginx config file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# runs at port 80
# to run do `docker run -p 80:[whatever port you want on host] [image name that you built]
# 80 is the port in the container and you are mapping it to the 2nd port number in your host computer
