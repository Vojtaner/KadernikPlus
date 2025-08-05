#Project setup

Project has two dockerfiles. The one that is meant to be hosted is not with .dev extension.
Before upload you may test build by building image within /frontend folder via:

```
docker build -t test-fe .
```

Then try if image is actually running (basic graphic, nothig else should work)

```
docker run -p 8083:8083 test-fe
```

The localhost:8083 should appear FE app running with no deep funcitonality.

ENV INJECTIONS GOES IN THE FOLLOWING WAY: https://dev.to/dutchskull/setting-up-dynamic-environment-variables-with-vite-and-docker-5cmj

RUN CONTAINER

```
docker run -it --rm -p 8083:8083 \
  -e PREFIX_API_URL=https://api.myproductionapi.com \
  -e PREFIX_PORT=8083 \
  -e PREFIX_ENABLE_MOCKS=false \
  -e PREFIX_IS_DEVELOPMENT=false \
  -e PREFIX_AUT0_DOMAIN=dev-ri7i8tb9.us.auth0.com \
  my-react-app
```
