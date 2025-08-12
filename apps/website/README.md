# Překlad

package.json má command, který vezme html soubor,kde je text vloží klíč, vytvoří json pro překlad a následně vloží překlad zpět...možné použít i dílčí komandy, aby se nepřemazaly udělané změny

```
/hlavní
npm run translate-extract-and-insert --file=blog.html

/vložení překladu
npm run translate-insert --file=index.html

/vytvoření klíčů a json
npm run translate-extract --file=index.html
```

#CSS minify

Minifikace CSS uvnitř lonyo/assets/css

```
npx clean-css-cli -o app.min.css app.css
```

#Iconset

https://www.svgrepo.com/svg/508014/credit-card?edit=true

Setting for card-blue.svg ->

```
padding:10%,thikness: 50%,BG Color:#c2e9ff,color: #2993d0,bgRadius: 10%,iconsize: 200px
```
