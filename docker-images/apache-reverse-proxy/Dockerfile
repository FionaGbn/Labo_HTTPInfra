# version
FROM php:7.4-apache

# installation de nano
RUN apt-get update && apt-get install nano

# copie des fichiers/dossier de configuration du reverse proxy dans le container
COPY apache2-foreground /usr/local/bin/
COPY templates /var/apache2/templates
# COPY conf/ /etc/apache2

# activation des modules
RUN a2enmod proxy proxy_http proxy_balancer lbmethod_byrequests headers 
# activation des virtual host
RUN a2ensite 000-* 001-*
