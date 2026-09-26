import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Package,
  MapPin,
  Calendar,
  CreditCard,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
} from 'lucide-react';
import { getOrderById } from '@/lib/wordpress';

interface Props {
  params: Promise<{ id: string }>;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; dot: string; badge: string; text: string; icon: React.ReactNode }
> = {
  processing: {
    label: 'Processing',
    dot: 'bg-amber-400',
    badge: 'bg-amber-50 border-amber-200',
    text: 'text-amber-700',
    icon: <Clock size={13} />,
  },
  'on-hold': {
    label: 'On Hold',
    dot: 'bg-amber-400',
    badge: 'bg-amber-50 border-amber-200',
    text: 'text-amber-700',
    icon: <Clock size={13} />,
  },
  completed: {
    label: 'Delivered',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-700',
    icon: <CheckCircle size={13} />,
  },
  pending: {
    label: 'Pending',
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-700',
    icon: <Clock size={13} />,
  },
  cancelled: {
    label: 'Cancelled',
    dot: 'bg-red-400',
    badge: 'bg-red-50 border-red-200',
    text: 'text-red-600',
    icon: <XCircle size={13} />,
  },
  refunded: {
    label: 'Refunded',
    dot: 'bg-red-400',
    badge: 'bg-red-50 border-red-200',
    text: 'text-red-600',
    icon: <XCircle size={13} />,
  },
  failed: {
    label: 'Failed',
    dot: 'bg-red-400',
    badge: 'bg-red-50 border-red-200',
    text: 'text-red-600',
    icon: <XCircle size={13} />,
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.06)] ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100">
      <span className="text-gray-400">{icon}</span>
      <h2 className="font-semibold text-sm text-gray-800 tracking-wide uppercase">{title}</h2>
    </div>
  );
}

function SummaryRow({
  label, value, highlight, bold,
}: {
  label: string; value: string; highlight?: boolean; bold?: boolean;
}) {
  return (
    <div className={`flex justify-between items-center text-sm ${bold ? 'font-semibold text-gray-900' : ''}`}>
      <span className={bold ? 'text-gray-900' : 'text-gray-500'}>{label}</span>
      <span className={highlight ? 'text-emerald-600 font-medium' : bold ? '' : 'text-gray-900 font-medium'}>
        {value}
      </span>
    </div>
  );
}

export default async function ViewOrderPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) return notFound();

  const status = STATUS_CONFIG[order.status] ?? {
    label: order.status,
    dot: 'bg-gray-400',
    badge: 'bg-gray-50 border-gray-200',
    text: 'text-gray-600',
    icon: <Package size={13} />,
  };

  const shipping = order.shipping || {};
  const addressParts = [
    shipping.address_1,
    shipping.city,
    shipping.state,
    shipping.postcode,
    shipping.country,
  ].filter(Boolean);
  const address = addressParts.length > 0 ? addressParts.join(', ') : null;
  const hasShippingInfo = shipping.first_name || shipping.last_name || address;

  const total = parseFloat(order.total).toFixed(2);
  const subtotal = total;

  return (
    <div className="min-h-screen">
      {/*
        Navbar — две строки:
          1) logo + search + icons : py-6 ≈ 72px
          2) nav links row         : py-4 ≈ 48px
          border-b                 : 1px
        Итого ~121px. pt-[136px] = небольшой визуальный отступ под navbar.
        Если navbar у вас другой высоты — измените это значение.
      */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-13 pt-[136px] pb-12">

        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-150" />
          Back to Orders
        </Link>

        {/* Order header */}
        <Card className="px-6 py-5 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Order #{order.id}</h1>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400">
              <Calendar size={12} />
              <span>{formatDate(order.date_created)}</span>
            </div>
          </div>
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border ${status.badge} ${status.text} self-start sm:self-auto`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.icon}
            {status.label}
          </div>
        </Card>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left */}
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <CardHeader icon={<Package size={15} />} title="Items" />
              <ul className="divide-y divide-gray-50">
                {order.line_items.map((item: any) => (
                  <li key={item.id} className="flex items-start gap-4 px-6 py-5">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                      {item.image?.src ? (
                        <Image src={item.image.src} alt={item.name} fill sizes="64px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">🌿</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 leading-snug truncate">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-1">Qty: {item.quantity} · ${item.price} each</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900 whitespace-nowrap">
                      ${parseFloat(item.total).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>

            {hasShippingInfo && (
              <Card className="px-6 py-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <MapPin size={15} className="text-gray-400" />
                  <h2 className="font-semibold text-sm text-gray-800 tracking-wide uppercase">Shipping Address</h2>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  {(shipping.first_name || shipping.last_name) && (
                    <p className="font-semibold text-gray-800">
                      {[shipping.first_name, shipping.last_name].filter(Boolean).join(' ')}
                    </p>
                  )}
                  {address && <p>{address}</p>}
                  {shipping.phone && <p className="text-gray-400">{shipping.phone}</p>}
                </div>
              </Card>
            )}
          </div>

          {/* Right */}
          <div className="space-y-5">
            <Card className="px-6 py-5">
              <h2 className="font-semibold text-sm text-gray-800 tracking-wide uppercase mb-4">Order Summary</h2>
              <div className="space-y-3">
                <SummaryRow label="Subtotal" value={`$${subtotal}`} />
                <SummaryRow label="Shipping" value="Free" highlight />
                <div className="border-t border-gray-100 pt-3">
                  <SummaryRow label="Total" value={`$${total}`} bold />
                </div>
              </div>
            </Card>

            <Card className="px-6 py-5">
              <div className="flex items-center gap-2.5 mb-3">
                <CreditCard size={15} className="text-gray-400" />
                <h2 className="font-semibold text-sm text-gray-800 tracking-wide uppercase">Payment</h2>
              </div>
              <p className="text-sm text-gray-600">
                {order.payment_method_title || order.payment_method || 'Bank Transfer'}
              </p>
            </Card>

            {order.customer_note && (
              <Card className="px-6 py-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <MessageSquare size={15} className="text-gray-400" />
                  <h2 className="font-semibold text-sm text-gray-800 tracking-wide uppercase">Note</h2>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{order.customer_note}</p>
              </Card>
            )}

            <div className="rounded-2xl bg-emerald-50/70 border border-emerald-100 px-6 py-5 text-center">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-100 mb-3">
                <Truck size={16} className="text-emerald-600" />
              </div>
              <p className="text-sm font-semibold text-gray-800">Need help?</p>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Contact our support team for any questions about your order.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}