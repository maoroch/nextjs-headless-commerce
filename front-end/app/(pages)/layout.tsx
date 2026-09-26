// app/layout.tsx
import type { Metadata } from "next";
import { FavouritesProvider } from "@/context/FavouritesContext";
import { CartProvider } from "@/context/Cartcontext";
import { AuthProvider } from "@/context/Authcontext";
import Navbar from "@/components/Navbar/NavbarMain";
import Footer from "@/components/Footer/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <>
        <AuthProvider>
          <CartProvider>
            <FavouritesProvider>
              <Navbar />
                {children}
              <Footer />
            </FavouritesProvider>
          </CartProvider>
        </AuthProvider>
      </>
  );
}