import { getPageMetadata } from '@/lib/seo';

export const metadata = getPageMetadata('privacy');

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
