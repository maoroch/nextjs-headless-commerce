import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/wordpress';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const params: Record<string, string> = {};

  // Only allow specific safe parameters
  const allowedParams = ['search', 'category', 'per_page', 'page', 'orderby', 'order', 'on_sale', 'stock_status', 'include'];

  searchParams.forEach((value, key) => {
    if (allowedParams.includes(key)) {
      params[key] = value;
    }
  });

  try {
    const products = await getProducts(params);
    return NextResponse.json(products);
  } catch (error) {
    console.error('API /products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}