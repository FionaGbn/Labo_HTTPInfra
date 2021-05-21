# Labo HTTP Infrastructure
Gamboni Fiona & Tevaearai Rébecca

### Etape 1: Serveur HTTP statique avec apache httpd

Dans dossier `docker-image/apache-php-image`:

- construire l'image: `sudo docker build -t res/apache_php . `

- lancer le container: `sudo docker run -p 9090:80 res/apache_php` 

Pour vérifier le bon fonctionnement:

- depuis un navigateur: `localhost:9090`

### Etape 2: Serveur HTTP dynamique avec express.js

Dans le dossier `docker-images/express-image`: 

- construire l'image: `sudo docker build -t res/express_animals . `
- lancer le container: `sudo docker run -p 3000:3000 res/express_animals`

Pour vérifier le bon fonctionnement:

- depuis un navigateur: `localhost:3000`

- en ligne de commande: `telnet localhost 3000`

  - puis envoyer la requête :

    ```bash
    GET / HTTP/1.0 CRLF
    CRLF
    ```

Dans les 2 cas une liste d'animaux en format JSON devrait être retournée.

### Etape 3: Reverse proxy avec apache (configuration statique)

La configuration du reverse proxy étant **statique**, il faut qu'aucun container tourne actuellement sur la machine:

- effectuer un `docker ps` et effectuer un `docker kill` de tous les containers actifs

Il faut préalablement lancer les  2 containers précédents (on part du principe que l'image a déjà été construite):

- lancer en background le container du serveur http statique:  `sudo docker run -d --name apache_static res/apache_php`

- lancer en background le container du serveur http dynamique: `sudo docker run -d --name express_dynamic res/express_animals`

Dans le dossier `docker-image/apache-reverse-proxy` :

- construire l'image: `sudo docker build -t res/apache_rp . `

- lancer le container: `sudo docker run -p 8080:80 res/apache_rp`

Pour que le navigateur puisse envoyer le header, il faut configurer le DNS:

- ajouter une résolution dans le fichier `/etc/hosts` :

```bash
127.0.0.1	res.demo.ch
```

Pour vérifier le bon fonctionnement:

- depuis un navigateur: 

  - pour le contenu du serveur statique: http://demo.res.ch:8080 
  - pour le contenu du serveur dynamique:  http://demo.res.ch:8080/api/animals/

- en ligne de commande: `telnet localhost 8080`

  - puis envoyer la requête:

  ```
  GET / HTTP/1.0 CRLF	    # ou GET /api/animals HTTP/1.0
  Host: demo.res.ch CRLF
  CRLF
  ```

### Etape 4: Requêtes AJAX avec JQuery



### Etape 5: Reverse proxy (configuration dynamique)

