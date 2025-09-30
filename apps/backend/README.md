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

#Smazání migrací a obnova

Z remote connection na railway je možné získat přes

```
npx prisma db pull --url="databáze-url"
```

prisma schéma na kterým se vygeneruje migrace, pak se vrátí schéma staré původně shiftnuté a udělá se nová migrace. Při deploy je třeba vymazat z DB migrace staré ne jen ze souboru, ty které by to narušovaly případně.

# Administrace databáze a schémat

Instalovat railway CLI a v "/backend"

```
npx railway connect
```

vytvoření schematu

```
CREATE SCHEMA IF NOT EXISTS kadernikplus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

kontrolovat schemata

```
SHOW DATABASES;
```

zobrazení počtu tabulek ve schematu, třeba zda bylo migrováno

```
SELECT COUNT(*) AS table_count FROM information_schema.tables WHERE table_schema = 'kadernikplus';
```

použití schematu

```
USE kadernikplus;
```

napojení na databázové schéma (formát i skutečné propojení)

```
// const x = 'mysql://${{MYSQLUSER}}:${{MYSQL_ROOT_PASSWORD}}@${{RAILWAY_PRIVATE_DOMAIN}}:3306/${{MYSQL_DATABASE}}
// const x = 'mysql://root:BGMPtqVUNHimbWymuAHWiefwqSQELZQG@$mysql.railway.internal:3306/kadernikplus'
```

vymazani schematu

```
DROP SCHEMA `kadernikplus`;
```

klonování nové schéma kadernikminus a ze starého kadernikplus - vytvoření clone skriptu

```
-- 1. Create the new schema
CREATE SCHEMA IF NOT EXISTS kadernikminus;

-- 2. Generate clone statements for all tables
SELECT CONCAT(
    'CREATE TABLE kadernikminus.', table_name, ' LIKE kadernikplus.', table_name, '; ',
    'INSERT INTO kadernikminus.', table_name, ' SELECT * FROM kadernikplus.', table_name, ';'
) AS clone_statement
FROM information_schema.tables
WHERE table_schema = 'kadernikplus';
```

```
CREATE TABLE kadernikminus.logentry LIKE kadernikplus.logentry;
INSERT INTO kadernikminus.logentry SELECT * FROM kadernikplus.logentry;

CREATE TABLE kadernikminus.payment LIKE kadernikplus.payment;
INSERT INTO kadernikminus.payment SELECT * FROM kadernikplus.payment;

CREATE TABLE kadernikminus.subscription LIKE kadernikplus.subscription;
INSERT INTO kadernikminus.subscription SELECT * FROM kadernikplus.subscription;

CREATE TABLE kadernikminus.team LIKE kadernikplus.team;
INSERT INTO kadernikminus.team SELECT * FROM kadernikplus.team;

CREATE TABLE kadernikminus.teammember LIKE kadernikplus.teammember;
INSERT INTO kadernikminus.teammember SELECT * FROM kadernikplus.teammember;

CREATE TABLE kadernikminus._prisma_migrations LIKE kadernikplus._prisma_migrations;
INSERT INTO kadernikminus._prisma_migrations SELECT * FROM kadernikplus._prisma_migrations;

CREATE TABLE kadernikminus.clients LIKE kadernikplus.clients;
INSERT INTO kadernikminus.clients SELECT * FROM kadernikplus.clients;

CREATE TABLE kadernikminus.photos LIKE kadernikplus.photos;
INSERT INTO kadernikminus.photos SELECT * FROM kadernikplus.photos;

CREATE TABLE kadernikminus.procedures LIKE kadernikplus.procedures;
INSERT INTO kadernikminus.procedures SELECT * FROM kadernikplus.procedures;

CREATE TABLE kadernikminus.services LIKE kadernikplus.services;
INSERT INTO kadernikminus.services SELECT * FROM kadernikplus.services;

CREATE TABLE kadernikminus.stock_allowances LIKE kadernikplus.stock_allowances;
INSERT INTO kadernikminus.stock_allowances SELECT * FROM kadernikplus.stock_allowances;

CREATE TABLE kadernikminus.stock_items LIKE kadernikplus.stock_items;
INSERT INTO kadernikminus.stock_items SELECT * FROM kadernikplus.stock_items;

CREATE TABLE kadernikminus.stocks LIKE kadernikplus.stocks;
INSERT INTO kadernikminus.stocks SELECT * FROM kadernikplus.stocks;

CREATE TABLE kadernikminus.users LIKE kadernikplus.users;
INSERT INTO kadernikminus.users SELECT * FROM kadernikplus.users;

CREATE TABLE kadernikminus.visit_services LIKE kadernikplus.visit_services;
INSERT INTO kadernikminus.visit_services SELECT * FROM kadernikplus.visit_services;

CREATE TABLE kadernikminus.visits LIKE kadernikplus.visits;
INSERT INTO kadernikminus.visits SELECT * FROM kadernikplus.visits;
```

# VYTVOŘENÍ TESTLINKU

High-level vytvořím větev bez pomlček, ideálně jedno slovo, špatně se to překládá pro vytvoření schématu. Automaticky je umožněno vytvoření PR environment v railway kopii ze staging, kde je auto generated DATABASE_URL. Predeploy step spustí node scripts/createSchema.js a ten vytvoří dynamické schéma v databázi staging a hlasí platný dynamický string DATABASE_URL pro kontrolu. Mohu zkontrolovat zda je schéma vytvořeno pomocí scriptu...lokálně doplnit

```
npx railway status
npx railway connect (případně)
npx railway environment
```

# Comgate

V portálu je nutné nastavit backend i frontend url nyní produkce a preprodukce a v env vyměnit heslo a merchant.
Na testlinkách nejde platba kvůli nekonzistentním URL.Vývoj kvůli callbacku url na localhost.

## Railway databáze

Přepnutí schématu pomocí nastavení v databazi env MYSQL_DATABASE na název schématu.
