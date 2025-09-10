## Starting local DB

**-d db** means detached mode. Output of container is visible only by docker exec to container, or in Docker desktop - easiest way.

```
docker compose up -d db
```

Quick look to last state of logs is by

```
docker compose logs db
```

Error Error: P3014 risma Migrate could not create the shadow database.

```
docker exec -it mysql-db-hairdresser mysql -u root -p
my_secret_password
```

```
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

After migration

```
docker exec -it mysql-db-hairdresser mysql -u root -p
my_secret_password
```

```
USE my_app_db;
SHOW TABLES;
Select * from users;
```

## Adminer

```
localhost:8080
```

### How flow works

1. REST API targets specific endpoint in routes
2. Controller handles incomming request
3. Calles UseCase scenario
4. UseCase function handles business logic adds visit, sends email...
5. Controller returns response to user

## Změna v prisma.schema

```
docker compose exec backend npx prisma migrate reset (vyprázdní schéma)
docker compose exec backend npx prisma migrate dev (vyprázdní schéma)
- smazat lokální node_modules/.prisma a dát lokálně v backend složce npx prisma generate
- cmd+shift+p a restartovat typescript
```
