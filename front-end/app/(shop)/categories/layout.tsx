import { getPageMetadata } from '@/lib/seo';

export const metadata = getPageMetadata('categories');

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}