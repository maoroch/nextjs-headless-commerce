'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/Cartcontext';

export default function CartPage() {
  const { items, removeFromCart, updateQty, clearCart, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white mt-40">
        <div className="px-4 sm:px-6 lg:px-15 py-16 mt-16 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-[#FFCAB3]/40 flex items-center justify-center mb-6">
            <ShoppingBag size={32} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-xs">
            Add some organic goodness to your cart and come back here.
          </p>
          <Link href="/shop" className="group inline-flex items-center gap-2 px-8 py-3 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-900 transition-colors">
            Browse Products
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white mt-40">
      <div className="px-4 sm:px-6 lg:px-15 py-8 sm:py-12 lg:py-16 mt-8 sm:mt-12 lg:mt-16">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Your Cart</h2>
            <p className="text-sm text-gray-500 mt-1">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={clearCart}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors font-medium">
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12 items-start">

          {/* Items */}
          <div className="flex flex-col gap-4">
            {items.map(({ product, quantity }) => {
              const image = product.images?.[0]?.src ?? '';
              return (
                <div key={product.id} className="flex gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
                  <Link href={`/shop/${product.slug}`}>
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                      {image ? (
                        <Image src={image} alt={product.name} fill sizes="96px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">🌿</div>
                      )}
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        {product.categories?.[0] && (
                          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                            {product.categories[0].name}
                          </span>
                        )}
                        <Link href={`/shop/${product.slug}`}>
                          <h4 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 hover:text-yellow-500 transition-colors">
                            {product.name}
                          </h4>
                        </Link>
                      </div>
                      <button onClick={() => removeFromCart(product.id)}
                        className="p-1.5 rounded-full hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Qty */}
                      <div className="flex items-center gap-1 border border-gray-200 rounded-full px-1 py-1">
                        <button onClick={() => updateQty(product.id, quantity - 1)}
                          className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{quantity}</span>
                        <button onClick={() => updateQty(product.id, quantity + 1)}
                          className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                          <Plus size={12} />
                        </button>
                      </div>
                      {/* Price */}
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          ${(parseFloat(product.price) * quantity).toFixed(2)}
                        </p>
                        {quantity > 1 && (
                          <p className="text-xs text-gray-400">${product.price} each</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="sticky top-28">
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <h3 className="font-bold text-lg mb-6">Order Summary</h3>

              <div className="flex flex-col gap-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal ({totalItems} items)</span>
                  <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout — WooCommerce checkout URL */}
              <a
                href={`/checkout`}
                className="group w-full border border-black rounded-full flex items-center justify-between pl-6 pr-2 py-2 transition-all duration-300 hover:bg-black hover:text-white hover:shadow-xl active:scale-95"
              >
                <span className="text-sm font-bold tracking-wide">Proceed to Checkout</span>
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center group-hover:bg-white transition-all duration-300 flex-shrink-0">
                  <ArrowRight className="text-white group-hover:text-black transition-colors" size={18} strokeWidth={2.5} />
                </div>
              </a>

              <Link href="/shop"
                className="block text-center text-sm text-gray-400 hover:text-black transition-colors mt-4 font-medium">
                Continue Shopping
              </Link>
            </div>

            {/* Promo hint */}
            <div className="mt-4 bg-[#B3E5C9] rounded-2xl p-4">
              <p className="text-xs font-semibold text-gray-700">🎉 You qualify for free shipping!</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}