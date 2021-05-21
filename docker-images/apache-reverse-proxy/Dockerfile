FROM php:7.4-apache

RUN apt-get update && apt-get install nano

COPY apache2-foreground /usr/local/bin/
COPY templates /var/apache2/templates
COPY conf/ /etc/apache2

# activer modules
RUN a2enmod proxy proxy_http
# activer virtual host
RUN a2ensite 000-* 001-*
