'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Package, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { useAuth } from '@/context/Authcontext';
import { useCart } from '@/context/Cartcontext';
import type { WCOrder } from '@/types/orders';
// Типы (можно вынести в lib)
type OrderStatus = 'pending' | 'processing' | 'on-hold' | 'completed' | 'cancelled' | 'refunded' | 'failed';


const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  processing: { label: 'Processing', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  'on-hold':  { label: 'On Hold',    bg: 'bg-yellow-100', text: 'text-yellow-700' },
  completed:  { label: 'Delivered',  bg: 'bg-[#B3E5C9]',  text: 'text-green-800'  },
  pending:    { label: 'Pending',    bg: 'bg-[#B3E5C9]/60', text: 'text-green-700'  },
  cancelled:  { label: 'Cancelled',  bg: 'bg-[#FFCAB3]',  text: 'text-red-700'    },
  refunded:   { label: 'Refunded',   bg: 'bg-[#FFCAB3]',  text: 'text-red-700'    },
  failed:     { label: 'Failed',     bg: 'bg-[#FFCAB3]',  text: 'text-red-700'    },
};

const FILTER_TABS = [
  { key: 'all',        label: 'All'        },
  { key: 'processing', label: 'Processing' },
  { key: 'pending',    label: 'Pending'    },
  { key: 'completed',  label: 'Delivered'  },
  { key: 'cancelled',  label: 'Cancelled'  },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function OrderCard({ order }: { order: WCOrder }) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[order.status] ?? { label: order.status, bg: 'bg-gray-100', text: 'text-gray-700' };
  const address = [order.shipping.address_1, order.shipping.city, order.shipping.country]
    .filter(Boolean).join(', ');

  const wpPublicUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? '';

  return (
    <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden transition-shadow duration-200 hover:shadow-md">
      {/* Header (клик для разворачивания) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 sm:px-8 py-5 cursor-pointer select-none"
        onClick={() => setExpanded(p => !p)}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            <Package size={18} className="text-gray-500" />
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-bold text-gray-900 text-sm">#{order.id}</span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.bg} ${status.text}`}>
                {status.label}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {formatDate(order.date_created)} · {order.line_items.length} item{order.line_items.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <span className="text-lg font-bold text-gray-900">${parseFloat(order.total).toFixed(2)}</span>
          <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-400 transition-colors">
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-gray-50 px-6 sm:px-8 py-5 flex flex-col gap-4">
          {order.line_items.map(item => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                {item.image?.src ? (
                  <Image src={item.image.src} alt={item.name} fill sizes="56px" className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">🌿</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                ${parseFloat(item.total).toFixed(2)}
              </span>
            </div>
          ))}

          <div className="h-px bg-gray-50 my-1" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {address && (
              <div>
                <p className="text-xs text-gray-400">Delivered to</p>
                <p className="text-sm text-gray-700 font-medium mt-0.5">{address}</p>
              </div>
            )}
<div className="flex items-center gap-3">
  {order.status === 'completed' && (
    <button className="group inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-900 active:scale-95 transition-all duration-200">
      <RotateCcw size={13} />
      Reorder
    </button>
  )}
  <Link href={`/view-order/${order.id}`} className="text-xs font-semibold text-gray-500 hover:text-black underline underline-offset-2 transition-colors">
    View details
  </Link>
</div>

          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<WCOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('per_page', '20');
        if (filter !== 'all') params.set('status', filter);
        const res = await fetch(`/api/orders?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [filter, user, token]);

  return (
    <div className="min-h-screen bg-white mt-40">
      <div className="px-4 sm:px-6 lg:px-15 py-8 sm:py-12 lg:py-16 mt-8 sm:mt-12 lg:mt-16">
        {/* Header */}
        <div className="mb-10 sm:mb-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">My Orders</h2>
            <p className="text-sm text-gray-500 mt-3">
              {loading ? 'Loading...' : `${orders.length} order${orders.length !== 1 ? 's' : ''} total`}
            </p>
          </div>
          <Link href="/shop" className="group inline-flex items-center gap-2 text-base font-semibold text-black hover:text-gray-600 transition-colors">
            Continue Shopping
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </Link>
        </div>

        {/* Not logged in banner */}
        {!user && (
          <div className="mb-8 bg-[#B3E5C9]/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="font-bold text-gray-900 mb-1">Sign in to see your orders</p>
              <p className="text-sm text-gray-500">Your full order history will appear once you're signed in.</p>
            </div>
            <Link href="/login"
              className="group inline-flex items-center gap-3 px-6 py-3 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-900 active:scale-95 transition-all duration-300 flex-shrink-0">
              Sign In
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {FILTER_TABS.map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                filter === key ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-20" />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-[#B3E5C9]/40 flex items-center justify-center mb-6">
              <Package size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders here</h3>
            <p className="text-gray-500 text-sm max-w-xs leading-relaxed mb-8">
              {filter === 'all' ? "You haven't placed any orders yet." : `No ${filter} orders found.`}
            </p>
            <Link href="/shop"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-900 hover:shadow-lg active:scale-95 transition-all duration-300">
              Start Shopping
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        )}

        {/* Orders list */}
        {!loading && orders.length > 0 && (
          <div className="flex flex-col gap-4">
            {orders.map(order => <OrderCard key={order.id} order={order} />)}
          </div>
        )}

        {/* Bottom CTA */}
        {!loading && orders.length > 0 && (
          <div className="flex justify-center mt-16 sm:mt-20">
            <Link href="/shop"
              className="group w-full sm:w-auto sm:min-w-80 border border-black rounded-full flex items-center justify-between pl-6 sm:pl-8 pr-2 py-2 sm:py-3 transition-all duration-300 ease-out hover:bg-black hover:text-white hover:shadow-xl active:scale-95">
              <span className="text-sm sm:text-base font-bold tracking-wide">Shop Again</span>
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