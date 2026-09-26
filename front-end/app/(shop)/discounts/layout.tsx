import { getPageMetadata } from '@/lib/seo';

export const metadata = getPageMetadata('discounts');

export default function DiscountsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}