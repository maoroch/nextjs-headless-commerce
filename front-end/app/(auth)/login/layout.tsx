// app/(main)/layout.tsx

import { getPageMetadata } from '@/lib/seo';
export const metadata = getPageMetadata('login');
export default function loginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}