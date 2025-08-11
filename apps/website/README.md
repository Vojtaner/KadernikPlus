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
