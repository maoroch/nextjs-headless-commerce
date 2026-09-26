import { NextRequest, NextResponse } from "next/server";

if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const WC_URL = process.env.WORDPRESS_URL ?? 'http://localhost:8080';
const WC_KEY = process.env.WC_CONSUMER_KEY ?? '';
const WC_SECRET = process.env.WC_CONSUMER_SECRET ?? '';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  if (!query || query.trim().length < 2) {
    return NextResponse.json([]);
  }

  // Строим URL вручную через строку — избегаем проблем с URL объектом
  const urlStr = `${WC_URL}/wp-json/wc/v3/products?consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}&search=${encodeURIComponent(query)}&per_page=6&status=publish`;

  console.log('Search URL (masked):', urlStr.replace(WC_SECRET, '***').replace(WC_KEY, 'ck_***'));

  try {
    const res = await fetch(urlStr, { cache: 'no-store' });
    if (!res.ok) {
      const text = await res.text();
      console.error('WC error:', res.status, text);
      return NextResponse.json([], { status: res.status });
    }
    const products = await res.json();
    return NextResponse.json(
// eslint-disable-next-line @typescript-eslint/no-explicit-any
      products.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.images?.[0]?.src ?? null,
        slug: p.slug,
      }))
    );
  } catch (e) {
    console.error('Search fetch error:', e);
    return NextResponse.json([], { status: 500 });
  }
}