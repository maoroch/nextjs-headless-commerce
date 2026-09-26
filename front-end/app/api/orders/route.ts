import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const WP_URL = process.env.WORDPRESS_URL || 'http://localhost:8080';
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;
const JWT_SECRET = process.env.JWT_AUTH_SECRET;

export async function GET(request: NextRequest) {
  // 1. Проверяем авторизацию
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token || !JWT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized: missing token or secret' }, { status: 401 });
  }

  let customerId: number | null = null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    // В зависимости от структуры токена от плагина JWT Authentication for WP REST API
    // обычно данные пользователя находятся в decoded.data.user.id
    customerId = decoded?.data?.user?.id ?? decoded?.user_id ?? decoded?.id ?? null;
    if (!customerId) {
      console.error('No user id in token:', decoded);
      return NextResponse.json({ error: 'Invalid token structure' }, { status: 401 });
    }
  } catch (err) {
    console.error('JWT verification failed:', err);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  // 2. Параметры запроса
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const perPage = searchParams.get('per_page') || '20';

  // 3. Формируем URL к WooCommerce API
  const url = new URL(`${WP_URL}/wp-json/wc/v3/orders`);
  url.searchParams.set('consumer_key', WC_KEY!);
  url.searchParams.set('consumer_secret', WC_SECRET!);
  url.searchParams.set('customer', String(customerId));
  url.searchParams.set('per_page', perPage);
  if (status && status !== 'all') {
    url.searchParams.set('status', status);
  }

  console.log('Fetching orders from:', url.toString().replace(WC_SECRET!, '***'));

  try {
    const res = await fetch(url.toString(), { cache: 'no-store' });
    const text = await res.text(); // читаем как текст, чтобы потом распарсить JSON

    // Replace internal WordPress URLs with public-facing ones
    const wpPublicUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost:8080';
    const updatedText = text.replace(/https?:\\?\/\\?\/(wordpress|server-coomendem\.local)(:[0-9]+)?/g, wpPublicUrl);

    let data;
    try {
      data = JSON.parse(updatedText);
    } catch (e) {
      console.error('Invalid JSON response:', text);
      return NextResponse.json({ error: 'Invalid response from WooCommerce' }, { status: 500 });
    }

    if (!res.ok) {
      console.error('WooCommerce API error:', res.status, data);
      return NextResponse.json(
        { error: data.message || 'WooCommerce API error' },
        { status: res.status }
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}