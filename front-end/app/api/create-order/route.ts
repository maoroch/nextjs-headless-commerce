import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const WP_URL = process.env.WORDPRESS_URL || 'http://localhost:8080';
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;
const JWT_SECRET = process.env.JWT_AUTH_SECRET;

export async function POST(req: NextRequest) {
  try {
    const { billing, line_items, payment_method, customer_note, shipping } = await req.json();

    // 1. Пытаемся получить customer_id из JWT
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    let customerId = 0;

    if (token && JWT_SECRET) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        // Структура токена зависит от плагина, обычно ID в decoded.data.user.id
        customerId = decoded?.data?.user?.id ?? decoded?.user_id ?? decoded?.id ?? 0;
      } catch (err) {
        console.error('Invalid token:', err);
      }
    }

    if (!billing?.email || !line_items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderData: any = {
      payment_method: payment_method || 'bacs',
      payment_method_title: payment_method === 'paypal' ? 'PayPal' : (payment_method === 'bacs' ? 'Direct Bank Transfer' : 'Cash on Delivery'),
      set_paid: payment_method === 'paypal',
      billing,
      shipping,
      line_items,
      customer_note: customer_note || '',
    };

    // 2. Если пользователь авторизован – привязываем заказ
    if (customerId > 0) {
      orderData.customer_id = customerId;
    }

    const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');
    const res = await fetch(`${WP_URL}/wp-json/wc/v3/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(orderData),
    });

    const text = await res.text();
    const wpPublicUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost:8080';
    const updatedText = text.replace(/https?:\\?\/\\?\/(wordpress|server-coomendem\.local)(:[0-9]+)?/g, wpPublicUrl);

    let order;
    try {
      order = JSON.parse(updatedText);
    } catch (e) {
      console.error('Invalid JSON response:', text);
      return NextResponse.json({ error: 'Invalid response from WooCommerce' }, { status: 500 });
    }

    if (!res.ok) {
      console.error('WooCommerce error:', order);
      return NextResponse.json({ error: order.message || 'Failed to create order' }, { status: res.status });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}