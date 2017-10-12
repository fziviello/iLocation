# iLocation
Tracking gps in "Real Time" sfruttando la libreria socket.io
Il progetto comprende una parte server scritta in nodeJS, una parte client scritta in AngulaJS, ed una parte mobile scritta in Android.

Requisiti
=========

Versione di node: 8.3.0

Versione di bower: 1.8.0

Versione di gulp: 3.9.1

Installazione
=============

npm install

npm install bower -g

npm install gulp -g

bower install

gulp init

Importare il dump del DB con lo script "ilocation.sql"

Configurazione
==============
Modificare nel file .env i parametri di connessione al vostro DB

Modificare nel file client/app.js la URL con il vostro indirizzo IP LOCALE

Avvio iLocation
===============
npm start => Avvia l'app

npm stop => Ferma l'app

Debug
=====
Nella root vengono salvati gli output (out.log) e gli errori (err.log) relativi all' applicazione avviata con forever.

Comandi GULP
============

gulp init : Installazione dipendenze bower (vendor), Creazione bundle.js, Creazione HTML/CSS/JS/MEDIA, Ottimizzazioni delle immagini

gulp start: gulp build + gulp watch

gulp build: Rigenerazione HTML/CSS/JS/MEDIA + gulp MinImage

gulp watch: Aggiornamento HTML/CSS/JS/MEDIA

gulp MinImage: Ottimizzazioni Immagini

gulp clean-all: Eliminazione build

gulp clean-dip: Eliminazione dipendenze di bower (vendors)

gulp clean-bundle: Eliminazione file bundle.js

gulp clean-lib: Eliminazione di HTML/CSS/JS/MEDIA
