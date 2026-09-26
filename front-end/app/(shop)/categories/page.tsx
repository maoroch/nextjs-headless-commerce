import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { getCategories, type WCCategory } from '@/lib/wordpress';

// Fallback accent colors cycling
const ACCENTS = ['bg-[#FFCAB3]', 'bg-[#B3E5C9]', 'bg-yellow-100'];

// Placeholder SVG когда у категории нет изображения
const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect width="800" height="600" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" font-size="64" text-anchor="middle" dominant-baseline="middle"%3E🌿%3C/text%3E%3C/svg%3E';

export default async function CategoriesPage() {
  let categories: WCCategory[] = [];
  try {
    const all = await getCategories();
    categories = all.filter(c => c.slug !== 'uncategorized');
  } catch { categories = []; }

  const featured = categories.slice(0, 2);
  const rest = categories.slice(2);

  return (
    <div className="min-h-screen bg-white mt-40">
      <div className="px-4 sm:px-6 lg:px-15 py-8 sm:py-12 lg:py-16 mt-8 sm:mt-12 lg:mt-16">

        {/* Header */}
        <div className="mb-10 sm:mb-12 lg:mb-16 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">All Categories</h2>
            <p className="text-sm sm:text-base text-gray-500 mt-3 leading-relaxed max-w-xl">
              Browse our full range of organic product categories — find exactly what you're looking for.
            </p>
          </div>
          <Link href="/shop" className="group inline-flex items-center gap-2 text-base font-semibold text-black hover:text-gray-600 transition-colors">
            View All Products
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </Link>
        </div>

        {categories.length === 0 && (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🌿</p>
            <h3 className="text-xl font-bold mb-2">No categories yet</h3>
            <p className="text-gray-500 text-sm">Add products with categories in WooCommerce and they'll appear here.</p>
          </div>
        )}

        {/* Featured top row — 2 large cards */}
        {featured.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-5 sm:mb-6">
            {featured.map((cat, i) => {
              const imgSrc = cat.image?.src ?? PLACEHOLDER;
              const accent = ACCENTS[i % ACCENTS.length];
              return (
                <Link key={cat.id} href={`/categories/${cat.slug}`}>
                  <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[280px] sm:min-h-[340px] flex items-end p-8 group cursor-pointer bg-gray-100">
                    <Image src={imgSrc} alt={cat.name} fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300" />
                    <div className="relative z-10 flex items-end justify-between w-full gap-4">
                      <div>
                        <span className={`inline-block px-3 py-1 ${accent} text-gray-800 text-xs font-semibold rounded-full mb-3`}>
                          {cat.count} product{cat.count !== 1 ? 's' : ''}
                        </span>
                        <h3 className="text-2xl font-bold text-white leading-tight">{cat.name}</h3>
                        {cat.description && (
                          <p className="text-white/70 text-sm mt-1 max-w-xs line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: cat.description }} />
                        )}
                      </div>
                      <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center flex-shrink-0 group-hover:bg-black transition-colors duration-300">
                        <ArrowRight size={18} className="text-black group-hover:text-white transition-colors duration-300 group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Remaining grid */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {rest.map((cat, i) => {
              const imgSrc = cat.image?.src ?? PLACEHOLDER;
              const accent = ACCENTS[(i + 2) % ACCENTS.length];
              return (
                <Link key={cat.id} href={`/categories/${cat.slug}`}>
                  <div className="group flex flex-col rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 bg-white">
                    <div className="relative h-44 overflow-hidden bg-gray-100">
                      <Image src={imgSrc} alt={cat.name} fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300" />
                      <span className={`absolute top-3 left-3 px-3 py-1 ${accent} text-gray-800 text-xs font-semibold rounded-full`}>
                        {cat.count} product{cat.count !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-gray-900 text-base mb-1.5 group-hover:text-yellow-500 transition-colors leading-snug">
                        {cat.name}
                      </h3>
                      {cat.description && (
                        <p className="text-xs text-gray-500 leading-relaxed flex-1 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: cat.description }} />
                      )}
                      <div className="flex items-center gap-1.5 mt-4 text-sm font-semibold text-black group-hover:gap-2.5 transition-all duration-200">
                        Shop now
                        <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="flex justify-center mt-16 sm:mt-20">
          <Link href="/shop"
            className="group w-full sm:w-auto sm:min-w-80 border border-black rounded-full flex items-center justify-between pl-6 sm:pl-8 pr-2 py-2 sm:py-3 transition-all duration-300 ease-out hover:bg-black hover:text-white hover:shadow-xl active:scale-95">
            <span className="text-sm sm:text-base font-bold tracking-wide">Browse All Products</span>
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-black flex items-center justify-center group-hover:bg-white transition-all duration-300 group-hover:scale-110 flex-shrink-0">
              <ArrowRight className="text-white group-hover:text-black transition-all duration-300 group-hover:translate-x-1" size={20} strokeWidth={2.5} />
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}