import Banner from "@/components/pages/home/Banner";
import LinkingWords from "@/components/pages/home/LinkingWords";
import ProductCatalog from "@/components/pages/home/ProductCatalog";
import Blog from "../../components/pages/home/Blog";
import Instagram from "@/components/pages/home/Instagram";
import Reviews from "@/components/pages/home/Reviews";
import Catalog from "../../components/pages/home/Catalog";
export default function Home() {
  return (
    <>
      <main>
        <Banner />
        <LinkingWords />
      </main>
      <ProductCatalog />
      <Catalog />
      <Blog />
      <Reviews />
      <Instagram />
    </>
  );
}