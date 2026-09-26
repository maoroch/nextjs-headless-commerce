// app/(main)/layout.tsx

import { getPageMetadata } from '@/lib/seo';
export const metadata = getPageMetadata('forgot-password');
export default function forgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}