FROM nginx:alpine

#protože je nastavená v dockercompose context na "." tak vycházím pro umístění souboru z mista, kde je yaml soubor

COPY ./website/nginx.conf /etc/nginx/conf.d/default.conf

COPY ./website/lonyo/ /usr/share/nginx/html/

EXPOSE 80
