import { getPageMetadata } from '@/lib/seo';

export const metadata = getPageMetadata('contact');

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
