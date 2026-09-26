import { getPageMetadata } from '@/lib/seo';

export const metadata = getPageMetadata('faq');

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
