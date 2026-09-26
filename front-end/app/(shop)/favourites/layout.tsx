import { getPageMetadata } from '@/lib/seo';

export const metadata = getPageMetadata('favourites');

export default function FavouritesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}