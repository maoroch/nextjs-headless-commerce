'use client';

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/context/Cartcontext';
import type { WCProduct } from '@/lib/wordpress';

export default function AddToCartButton({ product }: { product: WCProduct }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={!['instock'].includes(product.stock_status)}
      className={`flex-1 group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 active:scale-95
        ${added
          ? 'bg-[#B3E5C9] text-gray-800'
          : product.stock_status === 'instock'
            ? 'bg-black text-white hover:bg-gray-900'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
    >
      {added ? (
        <><Check size={16} /> Added!</>
      ) : (
        <><ShoppingCart size={16} /> Add to Cart</>
      )}
    </button>
  );
}