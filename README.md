# Labo HTTP Infrastructure

Gamboni Fiona & Tevaearai Rébecca

**Informations** 

- pour les étapes 1 à 5 nous avons suivi les webcasts, ainsi notre mise en place est similaire

### Etape 1: Serveur HTTP statique avec apache httpd

**Ajouts**

Configuration d'un serveur HTTP statique:

- utilisation de l'image officielle php (https://hub.docker.com/_/php) permettant de servir des pages php
- création d'un dossier `apache-php-image` contenant:
  - le Dockerfile permettant la construction de l'image
  - un dossier `src` contenant un template bootstrap (https://templatemag.com/bolt-bootstrap-agency-template/) auquel nous avons légérement modifié le fichier `index.html` 

**Utilisation**

Sur la branche `fb-apache-static` dans le dossier `docker-image/apache-php-image`:

- construire l'image: `sudo docker build -t res/apache_php . `

- lancer le container: `sudo docker run -p 9090:80 res/apache_php` 

Pour vérifier le bon fonctionnement:

- depuis un navigateur: `localhost:9090`

### Etape 2: Serveur HTTP dynamique avec express.js

**Ajouts**

Configuration d'un serveur HTTP dynamique:

- utilisation de l'image officielle node (https://hub.docker.com/_/node) permettant l'exécution de script Node.js
- création d'un dossier `express-image` contenant:
  - le Dockerfile permettant la construction de l'image
  - un dossier `src` contenant:
    - un `package.json`  créé par la commande  `npm init` 
    - une dépendance chance ajoutée par la commande `npm install chance`
    - un script `index.js` utilisant le framework express.js écoutant sur le port 3000 et permettant de générer une liste d'animaux lors d'une requête GET sur / 

**Utilisation**

Sur la branche `fb-express-dynamic` dans le dossier `docker-images/express-image`: 

- construire l'image: `sudo docker build -t res/express_animals . `
- lancer le container: `sudo docker run -p 3000:3000 res/express_animals`

**Vérification du bon fonctionnement** 

- depuis un navigateur: `localhost:3000`

- en ligne de commande: `telnet localhost 3000`

  - puis envoyer la requête :

    ```bash
    GET / HTTP/1.0 CRLF
    CRLF
    ```

Dans les 2 cas une liste d'animaux en format JSON devrait être retournée.

### Etape 3: Reverse proxy avec apache (configuration statique)

**Ajouts**

Construction d'un reverse proxy qui prenddes requêtes http et les distribue aux différents serveurs. La configuration du reverse proxy se trouve dans le dossier `apache-reverse-proxy` contenant: 

- le Dockerfile permettant la construction de l'image d'un serveur php
- un dossier `conf` contenant une arborescence respectant celle du système de fichier du container:
  - un dossier `sites-available` contenant les fichiers de configuration:
    -  le fichier `000-default-conf` permettant de ne rien retourner si l'utilisateur n'a pas spécifié correctement le domaine
    -  le fichier `001-reverse-proxy.conf` définissant le domaine et mappant les URLs à l'adresse des serveurs : **attention les adresses sont définies en brute**

**Utilisation**

La configuration du reverse proxy étant **statique**, il faut qu'aucun container tourne actuellement sur la machine:

- effectuer un `docker ps` suivi d'un `docker kill` sur tous les containers actifs

Il faut préalablement lancer les  2 containers précédents (en partant du principe que **les images du serveur HTTP statique et dynamique ont déjà été construites**: cf étapes 1 & 2):

- lancer en background le container du serveur http statique:  `sudo docker run -d --name apache_static res/apache_php`

- lancer en background le container du serveur http dynamique: `sudo docker run -d --name express_dynamic res/express_animals`

Sur la branche `fb-apache-reverse-proxy` dans le dossier `docker-image/apache-reverse-proxy` :

- construire l'image: `sudo docker build -t res/apache_rp . `

- lancer le container: `sudo docker run -p 8080:80 res/apache_rp`

Pour que le navigateur puisse envoyer le header, il faut configurer le DNS:

- ajouter une résolution dans le fichier `/etc/hosts` :

```
127.0.0.1	res.demo.ch
```

**Vérification du bon fonctionnement**

- depuis un navigateur: 

  - pour le contenu du serveur statique: http://demo.res.ch:8080 
  - pour le contenu du serveur dynamique:  http://demo.res.ch:8080/api/animals/

- en ligne de commande: `telnet localhost 8080`

  - puis envoyer la requête:

  ```
  GET / HTTP/1.0 CRLF	    # ou GET /api/animals HTTP/1.0 CRLF
  Host: demo.res.ch CRLF
  CRLF
  ```

### Etape 4: Requêtes AJAX avec JQuery

**Ajouts**

Utilisation de la librairie JQuery pour envoyer des requêtes AJAX vers le serveur dynamique afin de mettre à jour la page web:

- modification des Dockerfile pour pouvoir utiliser la commande nano dans les containers
- ajout d'un script `animal.js` dans le dossier `apache-php-image/src/js` :
  - définition d'une fonction `loadAnimals` utilisant la librairie JQuery pour envoyer une requête AJAX vers le serveur dynamique afin récupèrer une liste d'animaux
  - le premier animal de cette liste sera affiché sur la page web pour saluer l'utilisateur
  - la fonction est appelée toutes les 4 secondes 

**Utilisation**

Sur la branche `fb-ajax-jquery` dans le dossier `docker-images/apache-php-image` :

- (re)construire l'image: `sudo docker build -t res/apache_php .`

Lancer en background les 3 containers mentionnés précédents (en partant du principe que **les images du serveur HTTP dynamique et du reverse proxy ont déjà été construite**: cf étapes 2 & 3):

- lancer le container du serveur statique:  `sudo docker run -d --name apache_static res/apache_php`
- lancer le container du serveur dynamique: `sudo docker run -d --name express_dynamic res/express_animals`
- lancer le container du reverse proxy: `sudo docker run -d -p 8080:80 --name apache_rp res/apache_rp`

**Vérification du bon fonctionnement**

- depuis un navigateur:
  - des animaux vous saluerons chaleureusement ici http://demo.res.ch:8080 

### Etape 5: Reverse proxy (configuration dynamique)

**Ajouts**

Rendre la configuration du reverse proxy dynamique en passant des variables d'environnement au lancement du container et en générant un fichier de configuration à l'aide de PHP:

- permettre le passage de variable d'environnement au lancement du container
  - dans le dossier `apache-reverse-proxy`:
    - ajout du script `apache2-foreground` pour permettre la mise en place, l'affichage des variables d'environnement et la copie du fichier de configuration dans le container.
    - modification du Dockerfile pour copier le script `apache2-foreground` dans le container
- permettre à un interpréteur PHP de générer le fichier de configuration
  - dans le dossier `apache-reverse-proxy`:
    - ajout d'un dossier `templates` contenant un script `config-template.php` permettant de mapper les URLs aux adresses des serveurs transmis par des variables d'environnement. La configuration du reverse proxy est ainsi générée dynamiquement. 

**Utilisation**

Sur la branche `fb-dynamic-configuration` dans le dossier `docker-images/apache-reverse-proxy` 

- (re)construire l'image: `sudo docker build -t res/apache_rp . `

lancer en background les 3 containers mentionnés précédemment (en partant du principe que **les images du serveur HTTP statique et dynamique ont déjà été construites**:  cf étapes 2 & 4):

- lancer le container du serveur statique:  `sudo docker run -d --name apache_static res/apache_php`

- lancer le container du serveur dynamique: `sudo docker run -d --name express_dynamic res/express_animals`

- lancer le container du reverse proxy: `sudo docker run -d -e STATIC_APP=172.17.0.x:80 -e DYNAMIC_APP=172.17.0.y:3000 --name apache_rp -p 8080:80 res/apache_rp`

  **ATTENTION** à spécifier correctement les variables d'environnement:

  - adresse ip du container **apache_static** pour la variable **STATIC_APP**
  - adresse ip du container **express_dynamic** pour la variable **DYNAMIC_APP**
    -  si **aucun container actif**: `x = 2` et `y = 3`
    -  sinon pour récupérer l'adresse ip d'un container: `docker inspect countainer_name| grep -i ipaddr` 

**Vérification du bon fonctionnement**

- depuis un navigateur: http://demo.res.ch:8080 

## Etapes supplémentaires

### Load balancing: multiple server nodes

**Ajouts**

Permettre une répartition de la charge entre 2 serveurs HTTP statiques et 2 serveurs HTTP dynamiques: 

- dans le dossier `apache-reverse-proxy/templates`:
  - ajout d'un script `config-template2.php` utilisant le module `proxy_balancer` qui permet de créer un répartiteur statique et un répartiteur dynamique ayant comme membre les adresses des serveurs transmis par les variables d'environnement. Les URLs seront mappés sur les répartiteurs.

**Utilisation**

- dans le dossier `apache-reverse-proxy` la ligne du script `apache2-foreground` permettant la redirection doit être configurée comme ceci:

```
php /var/apache2/templates/config-template2.php > /etc/apache2/sites-available/001-reverse-proxy.conf
```

Lancer en background 5 containers (en partant du principe que **les images du serveur HTTP statique et dynamique et du reserve proxy ont déjà été construites**:  cf étapes 2, 4 & 5):

- lancer le 1r container du serveur statique: `sudo docker run -d --name apache_static1 res/apache_php`

- lancer le 2ème container du serveur statique: `sudo docker run -d --name apache_static2 res/apache_php`
- lancer le 1r container du serveur dynamique: `sudo docker run -d --name express_dynamic1 res/express_animals`
- lancer le 2ème container du serveur dynamique: `sudo docker run -d --name express_dynamic2 res/express_animals`
- lancer le container du reverse proxy: `sudo docker run -d -e STATIC_APP1=172.17.0.x:80 -e STATIC_APP2=172.12.0.y:80 -e DYNAMIC_APP1=172.17.0.z:3000 -e DYNAMIC_APP2=172.17.0.w:3000 --name apache_rp -p 8080:80 res/apache_rp`

**ATTENTION** à spécifier correctement les variables d'environnement:

- adresse ip du container **apache_static1** et **apache_static2** pour les variables **STATIC_APP1** et **STATIC_APP2**
- adresse ip du container **express_dynamic1** et **express_dynamic2**  pour les variables **DYNAMIC_APP1** et **DYNAMIC_APP2**
  -  si **aucun container actif**: `x=2`, `y=3`, `z=4` et `w=5`
  - sinon pour récupérer l'adresse ip d'un container: `docker inspect countainer_name| grep -i ipaddr`

**Vérification du bon fonctionnement**

- depuis un navigateur: http://demo.res.ch:8080 

### Load balancing: round-robin vs sticky sessions

**Ajouts**

Permettre que le répartiteur statique supporte l'abonnement utilisateur (sticky session) vers les serveurs statiques et que le répartiteur dynamique distribue les requêtes de façon alternée (round-robin) vers les serveurs dynamiques:

- dans le dossier `apache-reverse-proxy/templates`:
  - ajout d'un script `config-template3.php` utilisant les modules `headers` et `lbmethod_byrequests` permettant:
    - l'ajout d'un cookie au header pour les membres du répartiteur statique permettant de gérer une session.
    - l'utilisation d'un ordonnancement en round-robin pour les membres du répartiteur dynamique.

**Utilisation** 

- dans le dossier `apache-reverse-proxy` la ligne du script `apache2-foreground` permettant la redirection doit être configurée comme ceci:

```
php /var/apache2/templates/config-template3.php > /etc/apache2/sites-available/001-reverse-proxy.conf
```

Lancer en background 5 containers (en partant du principe que **les images du serveur HTTP statique et dynamique et du reserve proxy ont déjà été construites**:  cf étapes 2, 4 & 5):

- lancer le 1r container du serveur statique: `sudo docker run -d --name apache_static1 res/apache_php`

- lancer le 2ème container du serveur statique: `sudo docker run -d --name apache_static2 res/apache_php`
- lancer le 1r container du serveur dynamique: `sudo docker run -d --name express_dynamic1 res/express_animals`
- lancer le 2ème container du serveur dynamique: `sudo docker run -d --name express_dynamic2 res/express_animals`
- lancer le container du reverse proxy: `sudo docker run -d -e STATIC_APP1=172.17.0.x:80 -e STATIC_APP2=172.17.0.y:80 -e DYNAMIC_APP1=172.17.0.z:3000 -e DYNAMIC_APP2=172.17.0.w:3000 --name apache_rp -p 8080:80 res/apache_rp`

**ATTENTION** à spécifier correctement les variables d'environnement:

- adresse ip du container **apache_static1** et **apache_static2** pour les variables **STATIC_APP1** et **STATIC_APP2**
- adresse ip du container **express_dynamic1** et **express_dynamic2**  pour les variables **DYNAMIC_APP1** et **DYNAMIC_APP2**
  -  si **aucun container actif**: `x=2`, `y=3`, `z=4` et `w=5`
  -  sinon pour récupérer l'adresse ip d'un container: `docker inspect countainer_name| grep -i ipaddr`

**Vérification du bon fonctionnement**

- depuis un navigateur: http://demo.res.ch:8080 
