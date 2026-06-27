import HeroSection from "@/components/public/home/HeroSection";
import CategorySection from "@/components/public/home/CategorySection";
import FlashSaleSection from "@/components/public/home/FlashSaleSection";
import FeaturedProducts from "@/components/public/home/FeaturedProducts";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <FlashSaleSection />
      <FeaturedProducts />
    </>
  );
}