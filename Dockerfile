FROM nginx:alpine

WORKDIR /tmp

RUN wget https://github.com/mkoske/json-generator/archive/refs/heads/master.zip && \
    unzip  master.zip && \
    cp json-generator-master/public/* /usr/share/nginx/html && \
    rm -rf /tmp/json-generator-master


