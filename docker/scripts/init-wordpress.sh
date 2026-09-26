#!/bin/bash
set -e

echo "⏳ Waiting for DB..."

# Wait until we can connect to MySQL using PHP (to avoid mysql CLI SSL issues)
until php -r "
  mysqli_report(MYSQLI_REPORT_OFF);
  \$mysqli = @new mysqli('${WORDPRESS_DB_HOST}', '${WORDPRESS_DB_USER}', '${WORDPRESS_DB_PASSWORD}');
  if (\$mysqli->connect_errno) {
    exit(1);
  }
  exit(0);
"; do
  sleep 5
done

echo "🚀 Installing WordPress..."

if ! wp core is-installed --allow-root; then
  wp core install \
    --url="http://localhost:8080" \
    --title="Demo Shop" \
    --admin_user="admin" \
    --admin_password="admin123" \
    --admin_email="admin@test.com" \
    --skip-email \
    --allow-root
fi

# Enable pretty permalinks (crucial for WooCommerce REST API /wp-json/ endpoints to work)
echo "🔗 Configuring Permalinks..."
wp rewrite structure '/%postname%/' --allow-root

echo "🔐 Installing JWT Auth Plugin..."
wp plugin install jwt-auth --activate --allow-root || true
# Настраиваем константы для JWT в wp-config.php
wp config set JWT_AUTH_SECRET 'K8mP2xQvR9n9349534KJFEKEF3929023L4jH7wE1tY6uI3oA5sD0f' --type=constant --allow-root || true
wp config set JWT_AUTH_SECRET_KEY 'K8mP2xQvR9n9349534KJFEKEF3929023L4jH7wE1tY6uI3oA5sD0f' --type=constant --allow-root || true
wp config set JWT_AUTH_CORS_ENABLE true --type=constant --raw --allow-root || true

# Create complete .htaccess for WordPress routing & HTTP Authorization Header
cat << 'EOF' > /var/www/html/.htaccess
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress
EOF
chown www-data:www-data /var/www/html/.htaccess

# Extract uploaded assets if available and not already unpacked
if [ -f /docker-assets/uploads/uploads.zip ]; then
  IMAGE_COUNT=$(find /var/www/html/wp-content/uploads/ -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.webp" \) | wc -l)
  if [ "$IMAGE_COUNT" -lt 10 ]; then
    echo "📦 Extracting uploads.zip..."
    mkdir -p /var/www/html/wp-content/uploads
    unzip -q -o /docker-assets/uploads/uploads.zip -d /var/www/html/wp-content/uploads/
    chown -R www-data:www-data /var/www/html/wp-content/uploads/
    echo "✅ Assets extracted successfully!"
  fi
fi

echo "🧩 Installing WooCommerce..."

wp plugin install woocommerce --activate --force --allow-root || true

echo "🎨 Theme..."

wp theme install storefront --activate --force --allow-root || true

# Register the WooCommerce API key used by NextJS in the database
echo "🔑 Registering WooCommerce API Keys via PHP..."
php -r "
  \$mysqli = new mysqli('${WORDPRESS_DB_HOST}', '${WORDPRESS_DB_USER}', '${WORDPRESS_DB_PASSWORD}', '${WORDPRESS_DB_NAME}');
  if (\$mysqli->connect_error) {
    echo 'Connection failed: ' . \$mysqli->connect_error . \"\n\";
    exit(1);
  }
  \$ck_hash = hash('sha256', 'ck_797d10f97396b0ba4d26e9223c152a55376ff5d8');
  \$query = \"INSERT INTO wp_woocommerce_api_keys (key_id, user_id, description, permissions, consumer_key, consumer_secret, truncated_key) 
            VALUES (999, 1, 'NextJS API Key', 'read_write', '\$ck_hash', 'cs_489a9b3c932773f12b9959ae4f408a7201b8b181', '76ff5d8') 
            ON DUPLICATE KEY UPDATE consumer_key='\$ck_hash', consumer_secret='cs_489a9b3c932773f12b9959ae4f408a7201b8b181', truncated_key='76ff5d8', permissions='read_write'\";
  if (!\$mysqli->query(\$query)) {
    echo 'Query failed: ' . \$mysqli->error . \"\n\";
    exit(1);
  }
  echo 'Success: Keys registered successfully.\n';
"

echo "🎉 Done"

exec apache2-foreground