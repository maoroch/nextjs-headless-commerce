import { getPageMetadata } from '@/lib/seo';

export const metadata = getPageMetadata('orders');

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}