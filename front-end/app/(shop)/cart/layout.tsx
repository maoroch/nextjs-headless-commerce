// app/(shop)/cart/layout.tsx
import { getPageMetadata } from '@/lib/seo';

export const metadata = getPageMetadata('cart');

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}