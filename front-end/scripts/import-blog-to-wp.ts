// scripts/import-blog-to-wp.ts
// Запуск: npx tsx scripts/import-blog-to-wp.ts
// Зависимость: npm install -D tsx

import fs from 'fs';
import path from 'path';

const WP_URL = process.env.WORDPRESS_URL || 'http://localhost:8080';
const WP_USER = process.env.WP_USER ?? 'admin';
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD ?? '';

if (!WP_APP_PASSWORD) {
  console.error('❌  Укажи WP_APP_PASSWORD');
  console.error('   Создай в: WP Admin → Users → Profile → Application Passwords');
  process.exit(1);
}

const AUTH = Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString('base64');
console.log(`\n🌐 WordPress: ${WP_URL}`);
console.log(`👤 Пользователь: ${WP_USER}\n`);

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  featured: boolean;
  tags: string[];
  content: string[];
}

// ─── Проверка соединения и авторизации ───
async function checkAuth(): Promise<void> {
  const res = await fetch(`${WP_URL}/wp-json/wp/v2/users/me`, {
    headers: { Authorization: `Basic ${AUTH}` },
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`❌  Ошибка авторизации (${res.status}): ${body}`);
    console.error('\n⚠️  Убедись что:');
    console.error('   1. WP_APP_PASSWORD — это Application Password, не обычный пароль');
    console.error('   2. Создаётся в: WP Admin → Users → Profile → Application Passwords');
    console.error('   3. Копируется полностью включая пробелы: "xxxx xxxx xxxx xxxx xxxx xxxx"');
    process.exit(1);
  }
  const user: { name: string } = await res.json();
  console.log(`✅ Авторизован как: ${user.name}\n`);
}

// ─── Получить или создать категорию → вернуть number ───
async function getOrCreateCategory(name: string): Promise<number> {
  const slug = name.toLowerCase().replace(/\s+/g, '-');

  // Ищем существующую
  const searchRes = await fetch(
    `${WP_URL}/wp-json/wp/v2/categories?slug=${encodeURIComponent(slug)}`,
    { headers: { Authorization: `Basic ${AUTH}` } }
  );
  const existing = await searchRes.json() as Array<{ id: number; name: string }>;

  if (Array.isArray(existing) && existing.length > 0 && existing[0].id) {
    console.log(`    📁 Категория "${name}" → id: ${existing[0].id}`);
    return Number(existing[0].id);
  }

  // Создаём
  const createRes = await fetch(`${WP_URL}/wp-json/wp/v2/categories`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${AUTH}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, slug }),
  });

  const data = await createRes.json() as { id?: number; code?: string; message?: string };

  if (!createRes.ok || !data.id) {
    console.error(`    ❌ Не удалось создать категорию "${name}": ${JSON.stringify(data)}`);
    // Возвращаем 1 (Uncategorized) как fallback
    return 1;
  }

  console.log(`    📁 Создана категория "${name}" → id: ${data.id}`);
  return Number(data.id);
}

// ─── Получить или создать тег → вернуть number ───
async function getOrCreateTag(name: string): Promise<number | null> {
  const slug = name.toLowerCase().replace(/\s+/g, '-');

  const searchRes = await fetch(
    `${WP_URL}/wp-json/wp/v2/tags?slug=${encodeURIComponent(slug)}`,
    { headers: { Authorization: `Basic ${AUTH}` } }
  );
  const existing = await searchRes.json() as Array<{ id: number }>;

  if (Array.isArray(existing) && existing.length > 0 && existing[0].id) {
    return Number(existing[0].id);
  }

  const createRes = await fetch(`${WP_URL}/wp-json/wp/v2/tags`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${AUTH}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, slug }),
  });

  const data = await createRes.json() as { id?: number; code?: string; message?: string };

  if (!createRes.ok || !data.id) {
    console.error(`    ⚠️  Не удалось создать тег "${name}": ${JSON.stringify(data)}`);
    return null;
  }

  return Number(data.id);
}

// ─── Проверить существует ли пост ───
async function postExists(slug: string): Promise<boolean> {
  const res = await fetch(
    `${WP_URL}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}`,
    { headers: { Authorization: `Basic ${AUTH}` } }
  );
  const posts = await res.json() as unknown[];
  return Array.isArray(posts) && posts.length > 0;
}

// ─── Параграфы → HTML ───
function contentToHtml(paragraphs: string[]): string {
  return paragraphs.map((p) => `<p>${p}</p>`).join('\n\n');
}

// ─── Главная функция ───
async function importPosts(): Promise<void> {
  await checkAuth();

  const jsonPath = path.join(process.cwd(), 'data', 'blog.json');
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌  Файл не найден: ${jsonPath}`);
    process.exit(1);
  }

  const posts: BlogPost[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`📦 Найдено ${posts.length} постов в blog.json\n`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const post of posts) {
    console.log(`→ "${post.title}"`);

    if (await postExists(post.slug)) {
      console.log(`  ⏭  Пропущен (уже существует)\n`);
      skipped++;
      continue;
    }

    // Категория — гарантированно number
    const categoryId: number = await getOrCreateCategory(post.category);

    // Теги — фильтруем null
    const tagIdsMaybeNull = await Promise.all(
      post.tags.map((tag) => getOrCreateTag(tag))
    );
    const tagIds: number[] = tagIdsMaybeNull.filter((id): id is number => id !== null);

    // Дата
    const postDate = new Date(post.date).toISOString();

    const body = {
      title: post.title,
      slug: post.slug,
      content: contentToHtml(post.content),
      excerpt: post.excerpt,
      status: 'publish',
      date: postDate,
      date_gmt: postDate,
      sticky: post.featured,
      categories: [categoryId],    // number[]
      tags: tagIds,          // number[]
    };

    const res = await fetch(`${WP_URL}/wp-json/wp/v2/posts`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${AUTH}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await res.json() as { id?: number; link?: string; code?: string; message?: string };

    if (!res.ok || !result.id) {
      console.error(`  ❌ Ошибка (${res.status}): ${result.message ?? JSON.stringify(result)}\n`);
      failed++;
      continue;
    }

    console.log(`  ✅ Создан id: ${result.id} → ${result.link}\n`);
    created++;
  }

  console.log('─'.repeat(50));
  console.log(`📊 Итог: создано ${created}, пропущено ${skipped}, ошибок ${failed}`);

  if (created > 0) {
    console.log('\n⚠️  Изображения: загрузи вручную через WP Admin → Media');
    console.log('   и назначь как Featured Image для каждого поста.\n');
  }
}

importPosts().catch((e: Error) => {
  console.error('❌ Критическая ошибка:', e.message);
  process.exit(1);
});