import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { getOrderById } from '@/lib/wordpress';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) return notFound();

  const total = parseFloat(order.total).toFixed(2);
  const date = new Date(order.date_created).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-white mt-40">
      <div className="px-4 sm:px-6 lg:px-15 py-16 mt-16 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-[#B3E5C9] flex items-center justify-center mb-6">
          <CheckCircle size={32} className="text-gray-800" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Thank you for your order!</h2>
        <p className="text-gray-500 text-sm max-w-md leading-relaxed mb-4">
          Your order <strong className="text-black">#{order.id}</strong> has been received.
        </p>
        <p className="text-gray-400 text-sm mb-6">
          Placed on {date} · Total: ${total}
        </p>
        <Link
          href="/shop"
          className="group inline-flex items-center gap-2 px-8 py-3 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-900 transition-colors"
        >
          Continue Shopping
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}