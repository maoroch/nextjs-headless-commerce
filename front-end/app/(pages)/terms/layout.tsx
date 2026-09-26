import { getPageMetadata } from '@/lib/seo';

export const metadata = getPageMetadata('terms');

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
