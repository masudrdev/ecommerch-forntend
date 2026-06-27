import PublicHeader from "@/components/public/layout/PublicHeader";
import PublicFooter from "@/components/public/layout/PublicFooter";
import CartLoader from "@/components/public/cart/CartLoader";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
       <CartLoader />
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}