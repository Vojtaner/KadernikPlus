## Starting local DB

**-d db** means detached mode. Output of container is visible only by docker exec to container, or in Docker desktop - easiest way.

```
docker compose up -d db
```

Quick look to last state of logs is by

```
docker compose logs db
```
