# Kadernik Plus SW

There are 3 package.json files

```
npm i
cd apps/frontend
npm i
cd ..
cd ..
cd apps/backend
npm i
```

## Project level npm

Only for prettier

```
npm run format
```

## Frontend

```
cd apps/frontend
npm i
npm run start
```

## Backend

---

## Technologie

# Backend

- NODEJS
- ExpressJs
- Prisma - PostgresSQL/MySQL

# Technologie FE

- REACT
- Redux
- Storybook
- ReactHookForm
- TanstackQuery
- Axios
- MUI
- Cypress
- MSW
- Prettier
- Eslint

## UX Design aktuální

https://www.figma.com/proto/o3vTKSvA8oRV1SaflMLK4Z/Untitled?node-id=57-881&t=y09TiNlpIO6SdZ8V-0&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=46%3A662

## 🗂️ Celková struktura modulů

```
| Fáze | Moduly                                      | Co přináší                 |
| ---- | ------------------------------------------- | -------------------------- |
| 1.   | Klientky, návštěvy, služby, postupy, sklad  | Základní funkčnost         |
| 2.   | Fotky, SMS notifikace                       | Komfort a péče o zákazníka |
| 3.   | Věrnostní program, sklad                    | Udržení klientely, náklady |
| 4.   | Tržby, reporting, napojení API platby       | Efektivita podnikání       |
```

#### 🔹 FÁZE 1: MVP – Základní evidence klientek a návštěv, postupů

> 🎯 Cíl: Rychlé nasazení základního systému pro každodenní evidenci

##### ✅ Funkce:

1. Vytvoření, úprava a smazání klientek
2. Evidence návštěv klientek (datum, popis služeb, zaplacená cena, poznámky z návštěvy,historie)
3. Základní seznam služeb a jejich ceny
4. Implementace 0Auth loginu
5. Postupy na klientce gramy, časy, problémy
6. Sklad
7. Jedna fotka před a jedna fotka po návštěvě

##### 🗃️ Relační databáze:

```sql
users(id, name, email, password_hash,auth_provider,created_at,last_login)
clients(id, name, phone, email, note, birth_date)
visits(id, client_id, date, note, paid_price)
services(id, name, base_price)
visit_services(id, visit_id, service_id)
photos(id, visit_id, url)
procedures(id,visit_id,step_order,description,stock_item_id,,grams_used,time_minutes,issue,created_at)
photos(id,visit_id,url,uploaded_at,description popis)
stock_items(id, name, unit, quantity, threshold, is_active)
stock_allowances(id,user_id,stock_id)
```

---

#### 🔹 FÁZE 2: Automatizace a věrnostní systém

> 🎯 Cíl: Ulehčit rutinu a motivovat opakované návštěvy

##### ✅ Funkce:

1. SMS notifikace (ruční odesílání s návrhy zpráv v aplikaci, odeslání na 2 kliknutí, zdarma)
2. Věrnostní program: sleva po X návštěvách
3. Kalendář nebo přehled blížících se notifikací návštěv
4. Nákupní košík

##### 🗃️ Databázové tabulky:

```sql
notifications(id, client_id, type, message, date, sent, sent_at)
loyalty(id, client_id, visit_count, last_reward_date)

```

##### 🛠️ Backend:

## cron job (každý den kontrola, kdo má být upozorněn)

#### 🔹 FÁZE 3: Sklad, spotřeba a nákupní seznam

> 🎯 Cíl: Automatická kontrola zásob, plánování nákupu

##### ✅ Funkce:

1. Vydané poukázky seznam proti padělání
2. Generování nákupního seznamu (co je pod minimem)

##### 🗃️ Databáze:

```sql
stock (id,stock_item_id,quantity_movement,type [consumption, inventory diff],created_at,added_by)
vouchers (id,code,issued_to,issued_at,is_redeemed,redeemed_at,note)
```

---

#### 🔹 FÁZE 4: Tržby, náklady a reporting

> 🎯 Cíl: Podnikatelský přehled a řízení financí

##### ✅ Funkce:

1. Evidence nákladů (materiály, vybavení, služby, jiné)
2. Automatické tržby podle návštěv
3. Souhrny: zisk, náklady, obrat (den, týden, měsíc)
4. Statistiky: TOP klientky, nejčastější služby, vývoj tržeb
5. Navrhování ceny zákaznici (zdražení nákupů,inflace, dle poslední návštěvy)

##### 🗃️ Databáze:

```sql
revenues(id, date, visit_id, client_id, amount)
expenses(id, date, category, amount, description)
```

---

- Domyslet propojování modulů
- Cloudové úložiště pro fotky (začít s local disk)
- AI převod papírové kartotéky do digitální?
- Možnost přidávat poznámky a alergie k zákaznici
- načtení zboží podle eanu/předvytvoření databáze
