

## Baby steps 

- Vybrat auth libs a mit prototyp spojeny s nodejs backendem
- Rozhodnout o strukture kodu - monorepo, nebo dve repa backend/frontend. Me je to jedno, zalezi spis na preferencich
- seznamek technologii: Cesta nejmensiho odporu je nodejs backend a neco s Reactem. NEbranim se jinym, ale spolknou i nejaky uceni v tom pripade.
- nadefinovat, co je prvni milestone
- figmu lestit paralelne, soucasna figma je oproti stavu kodu dost daleko
- branching model bych nejak neprehanel, proste main,dev, cislo_tasku-nazev-feature
- byl bych za to mit to v prvni rade spustitelne lokalne komplet a az potom resit kam to nasadit a jak
- navrhnout entity
- rozhodnout se o databazi - relacni, nerelacni (mongo)
- zadefinovat entity a pak stanovit relace, hodne zhruba treba = user, userRole, materialItem, customer, customerMade
- podle zvyku bych navrhl, aby vsechen kod byl anglicky vcetne nayvu tabulek. Nikdy nevis, kdy to prodas Microsoftu za miliardu a půjdes do důchodu :D
- urcite bych si rovnou nechal od gpt vyblejt nejakej skriptik, kterej to nejak smysluplne naplni nahodnyma datama, abys rovnou videl jak to vypada.
- nejak se dohodnout, jak moc bude UI viset na 3rd parties. Co vsechno si vytvorime a co bude prepouzivat. Existuji nejake design systemky. 
- co se tyka programovani na backendu, tak bych se nebal. Pristupu, jak se k tomu postavit je asi vic. Pro zacatek neni zakazane prasit v "code behind", tedy přímo v kodu endpointu.

- roadmapka bez deadlinů říkající, jake featury po sobe budou vznikat. Nektere musi predchazet jine apod.
- zamyslet se, jak by asi vypadal reporting, aby se k tomu prizpusobilo schema db hned od zacatku

- trochu dokumentace = motivace a co je pro prvniho zakaznika/tenanta ta nejvetsi pridana hodnota, at se neprogramujou nejaky veci zbytecne
- rozhodnout se, jestli DB je multitenantni, nebo kazdy tenant ma svoji instanci. Oboji ma svoje vyhody.

- naprogramovat neco prvniho spustitelneho lokalne. 
- zdokumentovat lokalni spusteni

- otazku automatizovanych testu bych nechal spat

