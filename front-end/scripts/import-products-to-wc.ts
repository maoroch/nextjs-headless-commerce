// scripts/import-products-to-wc.ts
// Импортирует товары из data/products.json в WooCommerce
//
// Запуск:
//   npx tsx scripts/import-products-to-wc.ts

import fs from 'fs';
import path from 'path';

const WP_URL = process.env.WORDPRESS_URL || 'http://localhost:8080';
const WC_KEY = process.env.WC_CONSUMER_KEY ?? '';
const WC_SECRET = process.env.WC_CONSUMER_SECRET ?? '';
const WC = `${WP_URL}/wp-json/wc/v3`;

if (!WC_KEY || !WC_SECRET) {
  console.error('❌  Укажи WC_CONSUMER_KEY и WC_CONSUMER_SECRET в .env.local');
  console.error('   WP Admin → WooCommerce → Settings → Advanced → REST API');
  process.exit(1);
}

console.log(`\n🌐 WooCommerce: ${WP_URL}`);

// ─── Типы входного JSON ───
interface ProductJSON {
  id: number;
  name: string;
  description: string;
  fullDescription: string;
  price: number;
  salePrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  tags: string[];
}

// ─── Fetch хелпер ───
async function wcFetch<T>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' = 'GET',
  body?: object
): Promise<{ ok: boolean; status: number; data: T }> {
  const url = new URL(`${WC}${path}`);
  url.searchParams.set('consumer_key', WC_KEY);
  url.searchParams.set('consumer_secret', WC_SECRET);

  const res = await fetch(url.toString(), {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json() as T;
  return { ok: res.ok, status: res.status, data };
}

// ─── Проверка соединения ───
async function checkConnection(): Promise<void> {
  const { ok, data } = await wcFetch<{ message?: string }>('/products?per_page=1');
  if (!ok) {
    console.error(`❌  Не удалось подключиться к WooCommerce API`);
    console.error(`   Убедись что WC_CONSUMER_KEY и WC_CONSUMER_SECRET верные`);
    console.error(`   Детали:`, data);
    process.exit(1);
  }
  console.log(`✅ WooCommerce API доступен\n`);
}

// ─── Получить или создать категорию → id ───
async function getOrCreateCategory(name: string): Promise<number> {
  const slug = name.toLowerCase().replace(/\s+/g, '-');

  const { data: existing } = await wcFetch<Array<{ id: number }>>(
    `/products/categories?slug=${encodeURIComponent(slug)}`
  );
  if (Array.isArray(existing) && existing[0]?.id) {
    console.log(`    📁 Категория "${name}" → id: ${existing[0].id}`);
    return Number(existing[0].id);
  }

  const { ok, data: created } = await wcFetch<{ id?: number; message?: string }>(
    '/products/categories',
    'POST',
    { name, slug }
  );
  if (!ok || !created.id) {
    console.error(`    ⚠️  Не удалось создать категорию "${name}":`, created);
    return 0;
  }
  console.log(`    📁 Создана категория "${name}" → id: ${created.id}`);
  return Number(created.id);
}

// ─── Получить или создать тег → id ───
async function getOrCreateTag(name: string): Promise<number | null> {
  const slug = name.toLowerCase().replace(/\s+/g, '-');

  const { data: existing } = await wcFetch<Array<{ id: number }>>(
    `/products/tags?slug=${encodeURIComponent(slug)}`
  );
  if (Array.isArray(existing) && existing[0]?.id) {
    return Number(existing[0].id);
  }

  const { ok, data: created } = await wcFetch<{ id?: number }>(
    '/products/tags',
    'POST',
    { name, slug }
  );
  if (!ok || !created.id) return null;
  return Number(created.id);
}

// ─── Проверить существует ли товар по slug ───
async function productExists(slug: string): Promise<boolean> {
  const { data } = await wcFetch<unknown[]>(`/products?slug=${encodeURIComponent(slug)}`);
  return Array.isArray(data) && data.length > 0;
}

// ─── Сгенерировать slug из названия ───
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// ─── Главная функция ───
async function importProducts(): Promise<void> {
  await checkConnection();

  const jsonPath = path.join(process.cwd(), 'data', 'products.json');
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌  Файл не найден: ${jsonPath}`);
    console.error(`   Сохрани свой JSON как data/products.json`);
    process.exit(1);
  }

  const products: ProductJSON[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`📦 Найдено ${products.length} товаров в products.json\n`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const product of products) {
    const slug = toSlug(product.name);
    console.log(`→ "${product.name}"`);

    if (await productExists(slug)) {
      console.log(`  ⏭  Пропущен (уже существует)\n`);
      skipped++;
      continue;
    }

    // Категория
    const categoryId = await getOrCreateCategory(product.category);

    // Теги
    const tagIdsMaybeNull = await Promise.all(
      product.tags.map((t) => getOrCreateTag(t))
    );
    const tagIds = tagIdsMaybeNull
      .filter((id): id is number => id !== null)
      .map((id) => ({ id }));

    // Тело запроса для WooCommerce
    const body: Record<string, unknown> = {
      name: product.name,
      slug,
      type: 'simple',
      status: 'publish',
      description: `<p>${product.fullDescription}</p>`,
      short_description: `<p>${product.description}</p>`,
      regular_price: String(product.price),
      manage_stock: false,
      stock_status: 'instock',
      categories: categoryId ? [{ id: categoryId }] : [],
      tags: tagIds,
      // Изображения: WooCommerce не принимает локальные /img/ пути —
      // после импорта загрузи картинки вручную через WP Admin → Media
      // и назначь через Edit Product → Product image
    };

    // Sale price если есть
    if (product.salePrice) {
      body.sale_price = String(product.salePrice);
    }

    const { ok, status, data } = await wcFetch<{
      id?: number;
      permalink?: string;
      message?: string;
    }>('/products', 'POST', body);

    if (!ok || !data.id) {
      console.error(`  ❌ Ошибка (${status}): ${data.message ?? JSON.stringify(data)}\n`);
      failed++;
      continue;
    }

    console.log(`  ✅ Создан id: ${data.id} → ${data.permalink}\n`);
    created++;
  }

  console.log('─'.repeat(50));
  console.log(`📊 Итог: создано ${created}, пропущено ${skipped}, ошибок ${failed}\n`);

  if (created > 0) {
    console.log('⚠️  Изображения: WooCommerce не принимает локальные пути /img/...');
    console.log('   Загрузи картинки через WP Admin → Media,');
    console.log('   затем назначь каждому товару: Edit Product → Product image\n');
  }
}

importProducts().catch((e: Error) => {
  console.error('❌ Критическая ошибка:', e.message);
  process.exit(1);
});