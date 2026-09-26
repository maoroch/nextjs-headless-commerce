// app/api/shop/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getCategories, getSaleProducts, type WCProduct, type WCCategory } from '@/lib/wordpress';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type'); // 'products', 'categories', 'sale'
  const search = searchParams.get('search');
    
  
  try {
    if (type === 'categories') {
      const categories = await getCategories();
      return NextResponse.json(categories);
    }

    if (type === 'sale') {
      const saleProducts = await getSaleProducts();
      return NextResponse.json(saleProducts);
    }

    // По умолчанию — продукты с поддержкой параметров фильтрации
    const params: Record<string, string> = {};
    const perPage = searchParams.get('per_page');
    const category = searchParams.get('category');
    const onSale = searchParams.get('on_sale');
    const stockStatus = searchParams.get('stock_status');
    const orderby = searchParams.get('orderby');
    const order = searchParams.get('order');
    const include = searchParams.get('include');
    
    if (include) params.include = include;
    if (search) params.search = search;
    if (perPage) params.per_page = perPage;
    if (category) params.category = category;
    if (onSale === 'true') params.on_sale = 'true';
    if (stockStatus) params.stock_status = stockStatus;
    if (orderby) params.orderby = orderby;
    if (order) params.order = order;

    const products = await getProducts(params);
    return NextResponse.json(products);
  } catch (error) {
    console.error('API /shop error:', error);
    return NextResponse.json({ error: 'Failed to fetch shop data' }, { status: 500 });
  }
}