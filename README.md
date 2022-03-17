# Photos App

## Development

```sh
docker-compose up -d --build
```
This will build 3 docker containers (db, server, spa), install dependencies for each container, and start each container. Visit `localhost:8022` to see the SPA (single-page application) in the browser.

```sh
docker-compose down
```
This will stop all 3 containers.


## Logs
```sh
docker logs -f photos_app.db
```
```sh
docker logs -f photos_app.server
```
```sh
docker logs -f photos_app.spa
```


## Resources

* https://viralganatra.com/docker-nodejs-production-secure-best-practices/#node-images-and-version-pinning
* https://github.com/dev-mastery/comments-api
  * Video: [Using Clean Architecture for Microservice APIs in Node.js with MongoDB and Express](https://www.youtube.com/watch?v=CnailTcJV_U)
