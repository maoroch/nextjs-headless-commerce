'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Tag, Copy, Check, Sparkles } from 'lucide-react';

// ── Promo codes (replace with WooCommerce coupons API) ──
const PROMO_CODES = [
  {
    code: 'ORGANIC10',
    label: '10% off your first order',
    description: 'Valid for all products. No minimum spend.',
    expires: 'March 31, 2025',
    color: 'bg-[#B3E5C9]',
  },
  {
    code: 'FRESH20',
    label: '20% off orders over $50',
    description: 'Applies automatically at checkout.',
    expires: 'April 15, 2025',
    color: 'bg-[#FFCAB3]',
  },
  {
    code: 'SAVE15',
    label: '15% off seasonal items',
    description: 'Seasonal fruits, juices and breakfast items.',
    expires: 'March 20, 2025',
    color: 'bg-yellow-100',
  },
  {
    code: 'NEWUSER',
    label: 'Free shipping on first order',
    description: 'For new accounts only. One use per customer.',
    expires: 'No expiry',
    color: 'bg-[#B3E5C9]',
  },
];

function PromoCard({
  code, label, description, expires, color,
}: {
  code: string; label: string; description: string; expires: string; color: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`${color} rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 transition-all duration-300 hover:shadow-md`}>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">Promo code</span>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-widest">{code}</p>
        <p className="text-base font-semibold text-gray-800 mt-1">{label}</p>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <span className="text-xs text-gray-500">
          Expires: <span className="font-semibold text-gray-700">{expires}</span>
        </span>

        {/* Copy button — pill style matching landing */}
        <button
          onClick={copy}
          className={`group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 active:scale-95 ${
            copied
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-black hover:text-white'
          }`}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? 'Copied!' : 'Copy code'}
        </button>
      </div>
    </div>
  );
}

export default function DiscountsPage() {
  return (
    <div className="min-h-screen bg-white mt-40">
      <div className="px-4 sm:px-6 lg:px-15 py-8 sm:py-12 lg:py-16 mt-8 sm:mt-12 lg:mt-16">

        {/* ── Header ── */}
        <div className="mb-10 sm:mb-12 lg:mb-16 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              Deals &amp; Discounts
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-3 leading-relaxed max-w-xl">
              Exclusive promo codes and seasonal offers — copy a code and apply it at checkout.
            </p>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-base font-semibold text-black hover:text-gray-600 transition-colors"
          >
            Shop Now
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </Link>
        </div>

        {/* ── Hero banner ── */}
        <div
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden mb-12 sm:mb-16 min-h-[280px] sm:min-h-[380px] flex items-end p-8 sm:p-14"
          style={{
            backgroundImage: "url('/img/discounts/hero.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-8 w-full">
            {/* Text */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#FFCAB3] text-gray-800 text-xs font-semibold rounded-full mb-5">
                <Sparkles size={12} />
                Member offers
              </span>
              <h3 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-3">
                Save on every<br />organic order
              </h3>
              <p className="text-white/70 text-sm sm:text-base max-w-sm leading-relaxed">
                Use the promo codes below at checkout — stackable savings on your favourite organic products.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-8 flex-shrink-0">
              {[
                { value: '4', label: 'Active codes' },
                { value: 'Up to 20%', label: 'Max discount' },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-bold text-white">{value}</span>
                  <span className="text-white/60 text-xs mt-1 uppercase tracking-widest font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Promo codes section ── */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-full bg-[#B3E5C9] flex items-center justify-center">
              <Tag size={16} className="text-gray-700" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Available Codes</h2>
            <span className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-500 rounded-full">
              {PROMO_CODES.length} active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {PROMO_CODES.map(p => (
              <PromoCard key={p.code} {...p} />
            ))}
          </div>
        </div>

        {/* ── How it works ── */}
        <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-8 sm:p-10 mb-12 sm:mb-16">
          <h3 className="text-lg font-bold text-gray-900 mb-6">How to use a promo code</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Copy the code', desc: 'Click "Copy code" on any offer above.' },
              { step: '02', title: 'Add items to cart', desc: 'Browse the shop and add your favourite products.' },
              { step: '03', title: 'Paste at checkout', desc: 'Enter the code in the coupon field and save.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4">
                <span className="text-2xl font-bold text-gray-200 leading-none flex-shrink-0">{step}</span>
                <div>
                  <p className="font-bold text-gray-900 text-sm mb-1">{title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA — same pill as Catalog ── */}
        <div className="flex justify-center">
          <Link
            href="/shop"
            className="group w-full sm:w-auto sm:min-w-80 border border-black rounded-full flex items-center justify-between pl-6 sm:pl-8 pr-2 py-2 sm:py-3 transition-all duration-300 ease-out hover:bg-black hover:text-white hover:shadow-xl active:scale-95"
          >
            <span className="text-sm sm:text-base font-bold tracking-wide">Start Shopping</span>
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-black flex items-center justify-center group-hover:bg-white transition-all duration-300 group-hover:scale-110 flex-shrink-0">
              <ArrowRight
                className="text-white group-hover:text-black transition-all duration-300 group-hover:translate-x-1"
                size={20}
                strokeWidth={2.5}
              />
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}