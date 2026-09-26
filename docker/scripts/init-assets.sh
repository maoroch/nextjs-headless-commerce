#!/bin/sh

mkdir -p /var/www/html/wp-content/uploads

wget https://your-storage/demo-images.zip

unzip demo-images.zip \
-d /var/www/html/wp-content/uploads