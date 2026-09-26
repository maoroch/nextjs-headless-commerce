// lib/wordpress.ts
// WordPress REST API + WooCommerce utilities
// При деплое замени WORDPRESS_URL в .env.local на реальный домен

const WP_BASE = process.env.WORDPRESS_URL ?? 'http://localhost:8080';
const WC_KEY = process.env.WC_CONSUMER_KEY ?? '';
const WC_SECRET = process.env.WC_CONSUMER_SECRET ?? '';

const WPR = `${WP_BASE}/wp-json/wp/v2`;
const WC_BASE = `${WP_BASE}/wp-json/wc/v3`;


// ─── Типы — соответствуют реальному WP REST API ответу ───

export interface WPTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
  link: string;
}

export interface WPFeaturedMedia {
  id: number;
  source_url: string;
  alt_text: string;
  title: { rendered: string };
}

export interface WPPost {
  id: number;
  slug: string;
  date: string;
  sticky: boolean;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: WPFeaturedMedia[];
    'wp:term'?: WPTerm[][];
    author?: Array<{ name: string }>;
  };
}

export interface WCProduct {
  id: number;
  slug: string;
  name: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  rating_count: number;
  average_rating: string;
  categories: Array<{ id: number; name: string; slug: string }>;
  tags: Array<{ id: number; name: string; slug: string }>;
  images: Array<{ src: string; alt: string }>;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  featured: boolean;
}

export interface WCCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
  image: { src: string; alt: string } | null;
  description: string;
}

export interface WCCoupon {
  id: number;
  code: string;
  discount_type: 'percent' | 'fixed_cart' | 'fixed_product';
  amount: string;
  description: string;
  date_expires: string | null;
  usage_limit: number | null;
  free_shipping: boolean;
}

// ─── Fetch helper ───

async function wpFetch<T>(url: string, revalidate = 3600): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { next: { revalidate } });
  } catch (err) {
    throw new Error(
      `WordPress unreachable. Check that WP is running and WORDPRESS_URL is correct.\nURL: ${url}\n${err}`
    );
  }
  if (!res.ok) {
    throw new Error(`WordPress fetch error ${res.status}: ${url}`);
  }
  
  // Globally replace internal WordPress URL with public URL in the response JSON string
  const text = await res.text();
  const wpPublicUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost:8080';
  const matches = (text.match(/https?:\\?\/\\?\/(wordpress|localhost|server-coomendem\.local)(:[0-9]+)?/g) || []).length;
  console.log(`[wpFetch] Fetched: ${url} | Found ${matches} internal URLs. Replacing with: ${wpPublicUrl}`);
  const updatedText = text.replace(/https?:\\?\/\\?\/(wordpress|localhost|server-coomendem\.local)(:[0-9]+)?/g, wpPublicUrl);
  return JSON.parse(updatedText) as T;
}

function wcUrl(path: string, params: Record<string, string> = {}): string {
  const url = new URL(`${WC_BASE}${path}`);
  url.searchParams.set('consumer_key', WC_KEY);
  url.searchParams.set('consumer_secret', WC_SECRET);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  return url.toString();
}

// ─── Blog / Posts ───

export async function getPosts(perPage = 20): Promise<WPPost[]> {
  return wpFetch<WPPost[]>(
    `${WPR}/posts?_embed&per_page=${perPage}&orderby=date&order=desc`
  );
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const posts = await wpFetch<WPPost[]>(`${WPR}/posts?slug=${slug}&_embed`);
  return posts[0] ?? null;
}

// ─── Post helpers ───

export function getPostImage(post: WPPost): string {
  return (
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url ??
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect width="800" height="600" fill="%23f3f4f6"/%3E%3C/svg%3E'
  );
}

export function getPostCategory(post: WPPost): string {
  return post._embedded?.['wp:term']?.[0]?.[0]?.name ?? 'General';
}

export function getPostTags(post: WPPost): WPTerm[] {
  return post._embedded?.['wp:term']?.[1] ?? [];
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export function readTime(post: WPPost): string {
  const words = stripHtml(post.content.rendered).split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

// ─── WooCommerce Products ───

export async function getProducts(
  params: Record<string, string> = {}
): Promise<WCProduct[]> {
  return wpFetch<WCProduct[]>(
    wcUrl('/products', { per_page: '20', ...params, status: 'publish' })
  );
}

export async function getProductBySlug(slug: string): Promise<WCProduct | null> {
  try {
    const products = await wpFetch<WCProduct[]>(wcUrl('/products', { slug, per_page: '1' }));
    return products[0] ?? null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}


export async function getProductById(id: number): Promise<WCProduct> {
  return wpFetch<WCProduct>(wcUrl(`/products/${id}`));
}

export async function getSaleProducts(): Promise<WCProduct[]> {
  return wpFetch<WCProduct[]>(
    wcUrl('/products', { on_sale: 'true', per_page: '20', status: 'publish' })
  );
}

// ─── WooCommerce Categories ───

export async function getCategories(): Promise<WCCategory[]> {
  return wpFetch<WCCategory[]>(
    wcUrl('/products/categories', { per_page: '20' })
  );
}

// ─── WooCommerce Coupons ───

export async function getCoupons(): Promise<WCCoupon[]> {
  return wpFetch<WCCoupon[]>(wcUrl('/coupons', { per_page: '20' }));
}

// ─── Product helpers ───

export function getProductImage(product: WCProduct): string {
  return product.images?.[0]?.src ?? 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect width="800" height="600" fill="%23f3f4f6"/%3E%3C/svg%3E';
}

export function getDiscountPercent(product: WCProduct): number | null {
  if (!product.on_sale || !product.regular_price || !product.sale_price)
    return null;
  const reg = parseFloat(product.regular_price);
  const sale = parseFloat(product.sale_price);
  if (!reg) return null;
  return Math.round((1 - sale / reg) * 100);
}

export function isInStock(product: WCProduct): boolean {
  return product.stock_status === 'instock';
}

export function isOrganic(product: WCProduct): boolean {
  return product.tags.some((t) => t.slug === 'organic');
}

export async function getOrderById(id: number | string): Promise<any | null> {
  try {
    const url = wcUrl(`/orders/${id}`);
    return await wpFetch<any>(url, 0); // revalidate 0 — всегда свежие данные
  } catch (error) {
    console.error(`Failed to fetch order ${id}:`, error);
    return null;
  }
}