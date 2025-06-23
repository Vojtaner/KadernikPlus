## Starting local DB

**-d db** means detached mode. Output of container is visible only by docker exec to container, or in Docker desktop - easiest way.

```
docker compose up -d db
```

Quick look to last state of logs is by

```
docker compose logs db
```

When schema.prisma is changed
```
npx prisma migrate dev --name NAME_OF_MIGRATION
npx prisma generate
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
