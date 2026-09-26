import { getPageMetadata } from '@/lib/seo';

export const metadata = getPageMetadata('search');

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}