// components/ProductCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import type { WCProduct } from '@/lib/wordpress';

interface ProductCardProps {
  product: WCProduct;
  size?: 'small' | 'normal';
}

export function ProductCard({ product, size = 'normal' }: ProductCardProps) {
  const image = product.images?.[0]?.src ?? '';
  const isSmall = size === 'small';

  return (
    <Link href={`/shop/${product.slug}`}>
      <div className="group flex flex-col rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 bg-white">
        <div className={`relative ${isSmall ? 'aspect-square' : 'aspect-[4/5]'} bg-gray-50 overflow-hidden`}>
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes={isSmall ? '25vw' : '50vw'}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">🌿</div>
          )}
        </div>
        <div className="p-4">
          <h4 className="font-bold text-sm text-gray-900 line-clamp-2 mb-2 group-hover:text-yellow-500 transition-colors">
            {product.name}
          </h4>
          <span className="text-sm font-bold">${product.price}</span>
        </div>
      </div>
    </Link>
  );
}