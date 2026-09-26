'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, X, ArrowRight } from 'lucide-react';
import { useFavourites } from '@/context/FavouritesContext';
import { useCart } from '@/context/Cartcontext';
import type { WCProduct } from '@/lib/wordpress';

export default function FavouritesPage() {
  const { ids, toggleFavourite } = useFavourites();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<WCProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    // Загружаем все избранные товары одним запросом через API route
    const includeParam = ids.join(',');
    fetch(`/api/shop?type=products&include=${includeParam}&per_page=100`)
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [ids]);

  return (
    <div className="min-h-screen bg-white mt-40">
      <div className="px-4 sm:px-6 lg:px-15 py-8 sm:py-12 lg:py-16 mt-8 sm:mt-12 lg:mt-16">

        {/* Header */}
        <div className="mb-10 sm:mb-12 lg:mb-16 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">My Favourites</h2>
            <p className="text-sm sm:text-base text-gray-500 mt-3 leading-relaxed">
              {loading ? 'Loading...' : products.length > 0
                ? `${products.length} saved item${products.length !== 1 ? 's' : ''}`
                : 'No saved items yet'}
            </p>
          </div>
          <Link href="/shop" className="group inline-flex items-center gap-2 text-base font-semibold text-black hover:text-gray-600 transition-colors">
            Browse Shop
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </Link>
        </div>

        {/* Empty state */}
        {!loading && ids.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-[#FFCAB3]/40 flex items-center justify-center mb-6">
              <Heart size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nothing saved yet</h3>
            <p className="text-gray-500 text-sm max-w-xs leading-relaxed mb-8">
              Tap the heart on any product to save it here for later.
            </p>
            <Link href="/shop"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-900 hover:shadow-lg active:scale-95 transition-all duration-300">
              Explore Products
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {ids.map(id => <div key={id} className="rounded-xl bg-gray-100 animate-pulse aspect-square" />)}
          </div>
        )}

        {/* Grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {products.map(product => {
              const image = product.images?.[0]?.src ?? '';
              const organic = product.tags?.some(t => t.slug === 'organic');
              const rating = Number(product.average_rating);

              return (
                <div key={product.id}
                  className="product-item group flex flex-col rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg bg-white border border-gray-100">

                  {/* Image */}
                  <div className="relative overflow-hidden bg-gray-100 aspect-square">
                    <Link href={`/shop/${product.slug}`}>
                      {image ? (
                        <Image src={image} alt={product.name} fill
                          sizes="(max-width: 768px) 100vw, 25vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl">🌿</div>
                      )}
                    </Link>

                    {/* Organic badge */}
                    {organic && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-[#B3E5C9] text-gray-800 text-xs font-semibold rounded-full">
                        Organic
                      </span>
                    )}

                    {/* Remove from favourites */}
                    <button onClick={() => toggleFavourite(product.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md transition-all duration-200 hover:shadow-lg active:scale-90 hover:bg-[#FFCAB3]/30"
                      aria-label="Remove from favourites">
                      <X size={16} className="text-gray-500 hover:text-red-500 transition-colors" />
                    </button>

                    {/* Add to cart on hover */}
                    {product.stock_status !== 'outofstock' && (
                      <button onClick={() => addToCart(product)}
                        className="absolute bottom-3 right-3 p-2.5 rounded-full bg-black text-white shadow-md transition-all duration-200 hover:bg-gray-900 hover:shadow-lg active:scale-90 opacity-0 group-hover:opacity-100"
                        aria-label="Add to cart">
                        <ShoppingCart size={18} />
                      </button>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-4 sm:p-5">
                    {rating > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <Image src="/icons/star.svg" alt="Star" width={16} height={16} />
                          <span className="text-sm font-semibold text-black">{rating.toFixed(1)}</span>
                        </div>
                        {product.rating_count > 0 && (
                          <span className="text-xs text-gray-500">({product.rating_count} reviews)</span>
                        )}
                      </div>
                    )}

                    <Link href={`/shop/${product.slug}`}>
                      <h3 className="text-base sm:text-lg font-bold leading-snug mb-2 line-clamp-2 hover:text-yellow-500 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {product.short_description && (
                      <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-2 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: product.short_description }} />
                    )}

                    <div className="flex items-center justify-between gap-3 mt-auto">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-black">${product.price}</span>
                        {product.on_sale && product.regular_price && (
                          <span className="text-sm text-gray-400 line-through">${product.regular_price}</span>
                        )}
                      </div>
                      {product.stock_status !== 'outofstock' && (
                        <button onClick={() => addToCart(product)}
                          className="group/btn inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-900 active:scale-95 transition-all duration-200">
                          <ShoppingCart size={13} />
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        {!loading && products.length > 0 && (
          <div className="flex justify-center mt-16 sm:mt-20">
            <Link href="/shop"
              className="group w-full sm:w-auto sm:min-w-80 border border-black rounded-full flex items-center justify-between pl-6 sm:pl-8 pr-2 py-2 sm:py-3 transition-all duration-300 ease-out hover:bg-black hover:text-white hover:shadow-xl active:scale-95">
              <span className="text-sm sm:text-base font-bold tracking-wide">Discover More Products</span>
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-black flex items-center justify-center group-hover:bg-white transition-all duration-300 group-hover:scale-110 flex-shrink-0">
                <ArrowRight className="text-white group-hover:text-black transition-all duration-300 group-hover:translate-x-1" size={20} strokeWidth={2.5} />
              </div>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}