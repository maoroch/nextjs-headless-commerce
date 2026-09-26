<?php
/**
 * Plugin Name: Bypass WooCommerce API SSL Check
 * Description: Bypasses the SSL check for the WooCommerce REST API to allow HTTP query parameter authentication in local Docker development.
 * Author: Antigravity
 */

// Spoof SSL connection only for REST API requests to allow query parameters over HTTP
if ( isset( $_SERVER['REQUEST_URI'] ) && strpos( $_SERVER['REQUEST_URI'], '/wp-json/' ) !== false ) {
    $_SERVER['HTTPS'] = 'on';
}

// Bypasses check for legacy WooCommerce API
add_filter( 'woocommerce_api_check_ssl', '__return_false' );
