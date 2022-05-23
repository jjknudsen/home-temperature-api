#!/bin/bash
MY_PATH="`dirname \"$0\"`"
DOCKER="$(which docker)"

if [ "$1" ]; then
    DOCKER="$1"
fi;

$DOCKER stop xfinity-data-api
$DOCKER build -t jjknuds/xfinity-data-api "$MY_PATH"
$DOCKER rm xfinity-data-api
$DOCKER run -it --name xfinity-data-api -d \
--network knutty-network-ipv6 \
-p 3000:3000 \
-e TZ="America/Denver" \
--restart always \
jjknuds/xfinity-data-api npm start