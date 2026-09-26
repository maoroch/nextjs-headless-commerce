# 🌿 Coom Endem: Headless E-Commerce

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![WordPress](https://img.shields.io/badge/CMS-WordPress--Headless-blue?style=for-the-badge&logo=wordpress)](https://wordpress.org/)
[![WooCommerce](https://img.shields.io/badge/Shop-WooCommerce%20API-purple?style=for-the-badge&logo=woocommerce)](https://woocommerce.com/)
[![Docker](https://img.shields.io/badge/Container-Docker%20Compose-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

A production-ready, fully decoupled headless e-commerce store built with a **Next.js 16 App Router** frontend and a **WordPress + WooCommerce** API-first backend. The entire stack is containerized with **Docker Compose** for a zero-config, one-command local setup.

---

## 🎥 Demo Video

[![Watch Demo](./docs/demo-preview.png)](https://youtu.be/6r5WjiNnjlw)

🔗 Full demo: https://youtu.be/6r5WjiNnjlw

---

## 🎯 Why Headless?

Traditional WooCommerce stores couple the frontend and backend tightly — the same server that holds your database also renders every page. **Coom Endem** separates these concerns entirely, unlocking performance, security, and scalability that a monolithic setup simply can't match.

### Key Benefits

- **🚀 Superior Performance:** The Next.js frontend uses static page pre-rendering (SSG) and Incremental Static Regeneration (ISR), achieving near-perfect Core Web Vitals scores (LCP, INP) regardless of backend load.
- **🛡 Reduced Attack Surface:** WordPress admin and the database live behind the internal Docker network. The public internet never touches `/wp-admin/` or the MySQL instance directly, eliminating an entire class of SQL injection and brute-force vectors.
- **💰 Cost-Efficient Scaling:** The static Next.js frontend deploys to edge networks (Vercel, Netlify) for free and handles millions of pageviews without touching your server. The WordPress backend only serves API requests from Next.js, dramatically lowering required server specs.
- **✍ Familiar Content Management:** Shop managers and content editors keep working in the WordPress Admin Dashboard they already know — managing products, categories, orders, coupons, and blog posts without any code changes.

---

## 🗺 System Architecture

Built following the **C4 Software Architecture Model**.

### System Context

```
                   +---------------------+
                   | Visitor / Customer  |
                   +----------+----------+
                              |
                              | Browses / Purchases (HTTPS)
                              v
                   +---------------------+          Deploys to           +-------------------+
                   |  Next.js Storefront | +---------------------------> |   Vercel / Edge   |
                   +----------+----------+                               +-------------------+
                              |
                              | WooCommerce REST API (/wp-json/wc/v3/*) [Server-Side Only]
                              | JWT Authentication / SSL-Bypassed Query Params
                              v
                   +---------------------+          Runs on              +-------------------+
                   | WordPress Backend   | +---------------------------> | VPS / Host Server |
                   +----------+----------+                               +-------------------+
                              |
                              | Local TCP / Unix Socket
                              v
                   +---------------------+
                   |    MySQL 8 DB       |
                   +---------------------+
```

### How It Works Under the Hood

1. **BFF (Backend-for-Frontend) API Proxy:** All WooCommerce API calls are made strictly server-side via Next.js API Routes (`/api/shop`, `/api/products`). REST API keys are never exposed to the browser.
2. **Global Media URL Translation:** A custom utility rewrites internal container-facing image URLs (`https://wordpress/...`) to host-accessible public URLs (`http://localhost:8080/...`) across all JSON payloads before rendering — solving Docker network DNS resolution from the client.
3. **Internal SSL Spoofing for Local Dev:** A Must-Use WordPress plugin (`wp-content/mu-plugins/bypass-wc-ssl-check.php`) spoof `$_SERVER['HTTPS'] = 'on'` strictly for `/wp-json/` routes, allowing WooCommerce REST API authentication over local HTTP without SSL warnings.

---

## 🐳 One-Command Developer Setup

`docker compose up --build` orchestrates the entire stack automatically:

- **DB Auto-Seeding:** MySQL imports table structures, products, pages, and blog posts from `seed.sql` on first boot.
- **Asset Auto-Extraction:** If `wp-content/uploads` is empty, the container unpacks the 168 MB `uploads.zip` (product and blog images) and sets correct Apache permissions (`chown -R www-data:www-data`).
- **PayPal Integration:** Added PayPal checkout integration using `@paypal/react-paypal-js` with sandbox support and UI enhancements.
- **Pretty Permalinks:** WP-CLI configures permalink structure (`/%postname%/`) required for WooCommerce REST API routing.
- **Plugin & Theme Activation:** WP-CLI force-installs **WooCommerce 10.7.0** and the **Storefront** theme to guarantee a consistent state regardless of what the database already records.
- **Auto-Generated API Credentials:** A PHP script runs inside the container on startup, generates and hashes WooCommerce REST API keys, and writes them directly to `wp_woocommerce_api_keys`.
- **Compile-Time Race Condition Prevention:** Next.js uses a polling loop at startup to wait for a `200 OK` from the WordPress REST API before beginning `next build`, ensuring WordPress is fully ready before page pre-rendering starts.

---

## 📂 Project Structure

```
├── backend/
│   └── wordpress/           # WordPress persistent volume maps & plugins
│       ├── Dockerfile       # Custom WordPress + WP-CLI + Unzip image
│       └── wp-content/      # Themes, plugins, and uploaded assets
├── docker/
│   ├── assets/              # Compressed assets zip (uploads.zip)
│   ├── mysql/               # MySQL seed SQL dump (seed.sql)
│   └── scripts/             # Container initialization bash scripts
├── documentation/
│   └── diagrams/            # Architecture C4 & UML diagrams (PNG + PUML)
├── front-end/
│   ├── app/                 # Next.js 16 App Router (pages, components, API routes)
│   ├── lib/                 # Core API fetch client & URL rewrite utilities
│   ├── Dockerfile           # Next.js Node.js production build image
│   └── next.config.ts       # Next.js config & image optimization settings
├── docker-compose.yml       # Docker orchestration config
└── .env.example             # Environment variable reference
```

---

## 🚀 Getting Started

### Prerequisites

- **Docker** and **Docker Compose** installed on your Mac, Windows, or Linux machine.

Everything else — Node.js, PHP, MySQL, Apache — runs inside the containers.

### 1. Clone & Configure

```bash
git clone https://github.com/maoroch/coom-endem.git
cd coom-endem
cp .env.example .env
```

### 2. Start the Stack

```bash
docker compose down -v  # Clear any previous state
docker compose up --build
```

The startup scripts will install dependencies, unpack images, seed the database, and compile the Next.js app. This takes a few minutes on the first run.

### 3. Open in Browser

Once the Next.js container finishes compiling:

| Service | URL |
|---|---|
| 🛍 Next.js Storefront | [http://localhost:3000](http://localhost:3000) |
| ⚙️ WordPress Admin | [http://localhost:8080/wp-admin/](http://localhost:8080/wp-admin/) |
| 📦 DB Adminer | Available if enabled in compose |

**WordPress credentials:** `admin` / `admin123`

> If the storefront looks cached, open an incognito tab or hard-refresh with `Cmd+Shift+R`.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).