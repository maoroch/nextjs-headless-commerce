import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, ArrowLeft, Star, Package, Tag } from 'lucide-react';
import {
  getProductBySlug, getProducts, getDiscountPercent,
  isInStock, isOrganic, type WCProduct
} from '@/lib/wordpress';
import AddToCartButton from '@/components/AddToCartButton';
import FavouriteButton from '@/components/FavouriteButton';
import { ProductCard } from '@/components/ProductCard';
import ProductReviews from '@/components/ProductReviews';

interface Props {
  params: Promise<{ slug: string }>;
}
export const dynamic = 'force-dynamic';
export async function generateStaticParams() {
  try {
    const products = await getProducts({ per_page: '100' });
    return products.map((p: WCProduct) => ({ slug: p.slug }));
  } catch { return []; }
}

export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  const organic = isOrganic(product);
  const inStock = isInStock(product);
  const discount = getDiscountPercent(product);
  const image = product.images?.[0]?.src ?? '';
  const category = product.categories?.[0];
  const rating = Number(product.average_rating);

  const related = await getProducts({
    category: String(category?.id ?? ''),
    per_page: '4',
    exclude: String(product.id),
  }).catch(() => []);

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 sm:px-6 lg:px-15 pt-48 pb-16 sm:pb-20">
        {/* Back link */}
        <Link href="/shop"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-10 group font-medium">
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Shop
        </Link>

        {/* Main Card */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,500px)_1fr] rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 shadow-lg">
          {/* Image section (без изменений) */}
          <div className="flex items-center justify-center bg-gray-50 p-6 sm:p-10">
            <div className="relative w-full max-w-[420px] aspect-square rounded-2xl overflow-hidden bg-gray-100 mx-auto">
              {image ? (
                <Image src={image} alt={product.name} fill
                  className="object-cover transition-transform duration-500 hover:scale-105" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">🌿</div>
              )}
              {organic && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-[#B3E5C9] text-gray-800 text-xs font-semibold rounded-full">
                  Organic
                </span>
              )}
              {discount && (
                <span className="absolute top-4 right-4 px-3 py-1 bg-[#FFCAB3] text-gray-800 text-xs font-semibold rounded-full">
                  -{discount}%
                </span>
              )}
              {!organic && category && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-white text-gray-700 text-xs font-semibold rounded-full shadow-sm uppercase tracking-wide">
                  {category.name}
                </span>
              )}
            </div>
          </div>

          {/* Info section (без изменений) */}
          <div className="flex flex-col justify-between gap-6 p-8 sm:p-10 bg-white">
            <div className="flex flex-col gap-5">
              {rating > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14}
                        className={i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'} />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{rating.toFixed(1)}</span>
                  {product.rating_count > 0 && (
                    <>
                      <span className="text-gray-300">·</span>
                      <span className="text-gray-400 text-sm">{product.rating_count} reviews</span>
                    </>
                  )}
                </div>
              )}
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-gray-900">{product.name}</h1>
              {product.short_description ? (
                <div className="text-gray-600 text-base leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.short_description }} />
              ) : product.description ? (
                <div className="text-gray-600 text-base leading-relaxed line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: product.description }} />
              ) : null}
              {product.tags?.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {product.tags.map(tag => (
                    <span key={tag.slug} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-medium">
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-1">Price</span>
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-bold text-gray-900">${product.price}</span>
                  {product.on_sale && product.regular_price && (
                    <span className="text-lg text-gray-400 line-through mb-1">${product.regular_price}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FavouriteButton productId={product.id} />
                <AddToCartButton product={product} />
              </div>
            </div>
            <p className={`text-sm font-semibold flex items-center gap-2 ${inStock ? 'text-green-600' : 'text-red-500'}`}>
              <Package size={14} />
              {inStock ? 'In Stock' : 'Out of Stock'}
            </p>
          </div>
        </div>

        {/* Details Section (без изменений) */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {(product.description || product.short_description) && (
            <div className="md:col-span-2 bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-full bg-[#B3E5C9] flex items-center justify-center">
                  <Tag size={15} className="text-gray-700" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">About this product</h2>
              </div>
              <div className="text-gray-500 leading-[1.85] text-base prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description || product.short_description }} />
            </div>
          )}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-10 flex flex-col gap-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-full bg-[#FFCAB3] flex items-center justify-center">
                <Package size={15} className="text-gray-700" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Product Info</h2>
            </div>
            {([
              { label: 'Category', value: category?.name ?? '—' },
              { label: 'Rating',   value: rating > 0 ? `${rating.toFixed(1)} / 5` : '—' },
              { label: 'Reviews',  value: product.rating_count > 0 ? String(product.rating_count) : '—' },
              { label: 'Price',    value: `$${product.price}` },
              { label: 'Status',   value: inStock ? 'In Stock' : 'Out of Stock' },
            ]).map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-3.5 border-b border-gray-50 last:border-0">
                <span className="text-gray-400 text-sm">{label}</span>
                <span className="text-sm font-semibold text-gray-800">{value}</span>
              </div>
            ))}
            {product.tags?.length > 0 && (
              <div className="pt-4 flex flex-col gap-2">
                <span className="text-gray-400 text-sm">Tags</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {product.tags.map(tag => (
                    <span key={tag.slug} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-medium">
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-6">
              <Link href="/shop"
                className="group w-full border border-black rounded-full flex items-center justify-between pl-5 pr-2 py-2 transition-all duration-300 ease-out hover:bg-black hover:text-white active:scale-95">
                <span className="text-sm font-bold tracking-wide">Browse More</span>
                <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center group-hover:bg-white transition-all duration-300 flex-shrink-0">
                  <ArrowLeft size={16} className="text-white group-hover:text-black transition-colors duration-300 rotate-180" />
                </div>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Отзывы */}
        <ProductReviews productId={product.id} />

        {/* Related products — используем ProductCard */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
              {related.map((p: WCProduct) => (
                <ProductCard key={p.id} product={p} size="small" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}