# Xfinity Data API

### _Build, Remove, and Create Node App Container_

```bash
docker stop xfinity-data-api
docker build -t jjknuds/xfinity-data-api .
docker rm xfinity-data-api
docker run -it --name xfinity-data-api -d \
--network knutty-network \
-p 4000:3000 \
-e TZ="America/Denver" \
--restart always \
jjknuds/xfinity-data-api npm start
```

Or simply run `redploy_api.sh`
