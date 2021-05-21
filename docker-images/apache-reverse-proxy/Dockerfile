FROM php:7.2-apache

COPY conf/ /etc/apache2

# activer modules
RUN a2enmod proxy proxy_http
# activer virtual host
RUN a2ensite 000-* 001-*
