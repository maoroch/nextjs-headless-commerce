import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { getProducts, getProductImage, isOrganic, type WCProduct } from "@/lib/wordpress";

export default async function ProductCatalog() {
  let products: WCProduct[] = [];
  try {
    products = await getProducts({ per_page: '4', orderby: 'date', order: 'desc' });
  } catch {
    products = [];
  }

  return (
    <div className="product-catalog px-4 sm:px-6 lg:px-15 py-8 sm:py-12 lg:py-16 mt-8 sm:mt-12 lg:mt-16">

      {/* Header */}
      <div className="info mb-10 sm:mb-12 lg:mb-16 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-0">
        <div className="first-info flex-1">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
            Product Catalog
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-3 sm:mt-4 leading-relaxed max-w-2xl">
            Discover our range of organic products, carefully sourced and crafted to delight your senses.
          </p>
        </div>
        <Link href="/shop"
          className="group inline-flex items-center gap-2 text-base sm:text-lg font-semibold text-black hover:text-gray-700 transition-colors duration-200">
          View All Products
          <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
        </Link>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🌿</p>
          <p className="text-sm">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {products.map((product) => {
            const image = getProductImage(product);
            const organic = isOrganic(product);
            const rating = Number(product.average_rating);

            return (
              <div key={product.id}
                className="product-item group flex flex-col rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg bg-white">

                {/* Image */}
                <Link href={`/shop/${product.slug}`}>
                  <div className="relative overflow-hidden bg-gray-100 aspect-square">
                    <Image src={image} alt={product.name} fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105" />

                    {/* Organic badge */}
                    {organic && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-[#B3E5C9] text-gray-800 text-xs font-semibold rounded-full">
                        Organic
                      </span>
                    )}
                    {product.on_sale && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-[#FFCAB3] text-gray-800 text-xs font-semibold rounded-full">
                        Sale
                      </span>
                    )}

                    {/* Favourite — клиентская кнопка не работает в Server Component,
                        используем просто ссылку на страницу */}
                    <div className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md">
                      <Heart size={20} className="text-gray-600" />
                    </div>

                    {/* Cart */}
                    <div className="absolute bottom-3 right-3 p-2.5 rounded-full bg-black text-white shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <ShoppingCart size={20} />
                    </div>
                  </div>
                </Link>

                {/* Content */}
                <div className="flex flex-col flex-1 p-4 sm:p-5">
                  {rating > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Image src="/icons/star.svg" alt="Star" width={18} height={18} />
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
                    <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-2 leading-relaxed">
                      {product.short_description.replace(/<[^>]*>/g, '').trim()}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-auto">
                    <span className="text-lg font-bold text-black">${product.price}</span>
                    {product.on_sale && product.regular_price && (
                      <span className="text-sm text-gray-400 line-through">${product.regular_price}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="flex justify-center mt-12 sm:mt-16">
        <Link href="/shop"
          className="group w-full sm:w-auto sm:min-w-80 border border-black rounded-full flex items-center justify-between pl-6 sm:pl-8 pr-2 py-2 sm:py-3 transition-all duration-300 ease-out hover:bg-black hover:text-white hover:shadow-xl active:scale-95">
          <span className="text-sm sm:text-base font-bold tracking-wide">See All Products</span>
          <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-black flex items-center justify-center group-hover:bg-white transition-all duration-300 group-hover:scale-110 flex-shrink-0">
            <svg className="text-white group-hover:text-black transition-all duration-300 group-hover:translate-x-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
}