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

CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'