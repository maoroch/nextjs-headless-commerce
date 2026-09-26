// app/(main)/layout.tsx

import { getPageMetadata } from '@/lib/seo';
export const metadata = getPageMetadata('register');
export default function registerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}