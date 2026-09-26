'use client'
import { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, ArrowRight, Search, X } from 'lucide-react';
import { useCart } from '@/context/Cartcontext';
import { useFavourites } from '@/context/FavouritesContext';
import type { WCProduct } from '@/lib/wordpress';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleFavourite, isFavourite } = useFavourites();

  const initialQuery = searchParams.get('q') ?? '';
  const [inputValue, setInputValue] = useState(initialQuery);
  const [products, setProducts] = useState<WCProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortController = useRef<AbortController | null>(null);

  const doSearch = async (q: string) => {
    if (!q.trim()) {
      setProducts([]);
      setSearched(false);
      return;
    }
    if (abortController.current) abortController.current.abort();
    abortController.current = new AbortController();
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      params.set('type', 'products');
      params.set('search', q);
      params.set('per_page', '24');
      params.set('status', 'publish');
      const res = await fetch(`/api/shop?${params.toString()}`, {
        signal: abortController.current.signal,
      });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (e: any) {
      if (e?.name !== 'AbortError') setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) doSearch(initialQuery);
  }, [initialQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      router.replace(`/search?q=${encodeURIComponent(val)}`, { scroll: false });
      doSearch(val);
    }, 500);
  };

  const handleClear = () => {
    setInputValue('');
    setProducts([]);
    setSearched(false);
    router.replace('/search', { scroll: false });
  };

  return (
    <div className="min-h-screen bg-white mt-40">
      <div className="px-4 sm:px-6 lg:px-15 py-8 sm:py-12 lg:py-16 mt-8 sm:mt-12 lg:mt-16">

        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-6">
            {initialQuery ? `Results for "${initialQuery}"` : 'Search Products'}
          </h2>

          {/* Search input */}
          <div className="relative max-w-xl">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={e => e.key === 'Enter' && doSearch(inputValue)}
              placeholder="Search products..."
              autoFocus
              className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-black transition-colors bg-white"
            />
            {inputValue && (
              <button onClick={handleClear}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors">
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        {searched && !loading && (
          <p className="text-sm text-gray-500 mb-8">
            {products.length > 0
              ? `Found ${products.length} product${products.length !== 1 ? 's' : ''}`
              : 'No products found'}
          </p>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-gray-100 animate-pulse aspect-square" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && searched && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <Search size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500 text-sm max-w-xs leading-relaxed mb-8">
              Try different keywords or browse our full catalog.
            </p>
            <Link href="/shop"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-900 hover:shadow-lg active:scale-95 transition-all duration-300">
              Browse All Products
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        )}

        {/* Initial empty state — no query yet */}
        {!loading && !searched && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-[#B3E5C9]/40 flex items-center justify-center mb-6">
              <Search size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
              Start typing to search through our organic products.
            </p>
          </div>
        )}

        {/* Product grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {products.map(product => {
              const image = product.images?.[0]?.src ?? '';
              const organic = product.tags?.some(t => t.slug === 'organic');
              const fav = isFavourite(product.id);
              const rating = Number(product.average_rating);

              return (
                <div key={product.id}
                  className="group flex flex-col rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg bg-white border border-gray-100">

                  <Link href={`/shop/${product.slug}`}>
                    <div className="relative overflow-hidden bg-gray-100 aspect-square">
                      {image ? (
                        <Image src={image} alt={product.name} fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">🌿</div>
                      )}

                      {organic && (
                        <span className="absolute top-2 left-2 px-2.5 py-1 bg-[#B3E5C9] text-gray-800 text-xs font-semibold rounded-full">
                          Organic
                        </span>
                      )}
                      {product.on_sale && !organic && (
                        <span className="absolute top-2 left-2 px-2.5 py-1 bg-[#FFCAB3] text-gray-800 text-xs font-semibold rounded-full">
                          Sale
                        </span>
                      )}

                      {/* Favourite */}
                      <button onClick={e => { e.preventDefault(); toggleFavourite(product.id); }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow-md transition-all duration-200 hover:shadow-lg active:scale-90">
                        <Heart size={15}
                          className={fav ? 'fill-red-500 text-red-500' : 'text-gray-500 hover:text-red-500 transition-colors'} />
                      </button>

                      {/* Cart on hover */}
                      {product.stock_status !== 'outofstock' && (
                        <button onClick={e => { e.preventDefault(); addToCart(product); }}
                          className="absolute bottom-2 right-2 p-2 rounded-full bg-black text-white shadow-md transition-all duration-200 hover:bg-gray-900 active:scale-90 opacity-0 group-hover:opacity-100">
                          <ShoppingCart size={15} />
                        </button>
                      )}
                    </div>
                  </Link>

                  <div className="flex flex-col flex-1 p-3 sm:p-4">
                    {rating > 0 && (
                      <div className="flex items-center gap-1 mb-2">
                        <Image src="/icons/star.svg" alt="Star" width={13} height={13} />
                        <span className="text-xs font-semibold text-black">{rating.toFixed(1)}</span>
                        {product.rating_count > 0 && (
                          <span className="text-xs text-gray-400">({product.rating_count})</span>
                        )}
                      </div>
                    )}

                    <Link href={`/shop/${product.slug}`}>
                      <h3 className="text-sm font-bold leading-snug mb-2 line-clamp-2 hover:text-yellow-500 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2 mt-auto">
                      <span className="text-base font-bold text-black">${product.price}</span>
                      {product.on_sale && product.regular_price && (
                        <span className="text-xs text-gray-400 line-through">${product.regular_price}</span>
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
              <span className="text-sm sm:text-base font-bold tracking-wide">Browse All Products</span>
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
export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white mt-40 flex items-center justify-center">Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
