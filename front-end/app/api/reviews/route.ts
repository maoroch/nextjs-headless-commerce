import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const WP_URL = process.env.WORDPRESS_URL || 'http://localhost:8080';
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;
const JWT_SECRET = process.env.JWT_AUTH_SECRET;

// GET /api/reviews?product_id=123
export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get('product_id');
  if (!productId) {
    return NextResponse.json({ error: 'Missing product_id' }, { status: 400 });
  }

  const url = `${WP_URL}/wp-json/wc/v3/products/reviews?product=${productId}&consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`;
  try {
    const res = await fetch(url);
    const reviews = await res.json();
    return NextResponse.json(Array.isArray(reviews) ? reviews : []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST /api/reviews – добавление отзыва (только для авторизованных)
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token || !JWT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let userId: number | null = null;
  let userEmail: string | null = null;
  let userName: string | null = null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    userId = decoded?.data?.user?.id;
    userEmail = decoded?.data?.user?.email;
    userName = decoded?.data?.user?.displayName || decoded?.data?.user?.name || '';
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const body = await req.json();
  const { product_id, review, rating } = body;

  if (!product_id || !review || !rating) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Подготовка данных для WooCommerce
  const wcData = {
    product_id,
    review,
    reviewer: userName || userEmail,
    reviewer_email: userEmail,
    rating: Math.min(5, Math.max(1, rating)),
  };

  const url = `${WP_URL}/wp-json/wc/v3/products/reviews`;
  const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(wcData),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.message || 'Failed to post review' }, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}