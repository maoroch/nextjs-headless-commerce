FROM wordpress:php8.2-apache

# Download and install WP-CLI
RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x wp-cli.phar \
    && mv wp-cli.phar /usr/local/bin/wp

# Install mariadb-client for wp-cli to be able to talk to the db directly, and unzip for assets extraction
RUN apt-get update && apt-get install -y default-mysql-client unzip && rm -rf /var/lib/apt/lists/*

# Ensure we have our entrypoint script
COPY ../docker/scripts/init-wordpress.sh /usr/local/bin/init-wordpress.sh
RUN chmod +x /usr/local/bin/init-wordpress.sh

CMD ["/usr/local/bin/init-wordpress.sh"]