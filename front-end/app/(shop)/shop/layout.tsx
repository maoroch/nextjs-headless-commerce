import { getPageMetadata } from '@/lib/seo';

export const metadata = getPageMetadata('shop');

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}