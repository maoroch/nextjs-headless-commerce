// app/(main)/layout.tsx
import Navbar from "@/components/Navbar/NavbarMain";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}