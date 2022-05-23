#!/bin/bash
MY_PATH="`dirname \"$0\"`"
DOCKER="$(which docker)"

if [ "$1" ]; then
    DOCKER="$1"
fi;

$DOCKER stop home-temp-logger-api
$DOCKER build -t jjknuds/home-temp-logger-api "$MY_PATH"
$DOCKER rm home-temp-logger-api
$DOCKER run -it --name home-temp-logger-api -d \
--network knutty-network-ipv6 \
-p 3001:3001 \
-e TZ="America/Denver" \
--restart always \
jjknuds/home-temp-logger-api npm start