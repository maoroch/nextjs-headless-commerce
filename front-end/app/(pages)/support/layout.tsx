import { getPageMetadata } from '@/lib/seo';

export const metadata = getPageMetadata('support');

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
