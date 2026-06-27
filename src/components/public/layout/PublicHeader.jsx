"use client";
import CartIcon from "./CartIcon";
import Link from "next/link";
import { Menu, Search, User } from "lucide-react";
import { useSelector } from "react-redux";

export default function PublicHeader() {
  const user = useSelector((state) => state.auth.user);
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-3">
        <button className="md:hidden rounded-md border p-2">
          <Menu size={20} />
        </button>

        <Link href="/" className="text-xl font-bold text-orange-600">
          FriendBazar
        </Link>

        <div className="hidden flex-1 items-center rounded-md border md:flex">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-3 py-2 outline-none"
          />
          <button className="bg-orange-600 px-4 py-2 text-white">
            <Search size={18} />
          </button>
        </div>
        

<CartIcon />
{user ? (
  <div className="flex items-center gap-3">
    <span className="hidden md:block text-sm font-medium">
      {user.name}
    </span>

    <Link
      href="/dashboard"
      className="rounded-md bg-orange-600 px-3 py-2 text-sm text-white"
    >
      Dashboard
    </Link>
  </div>
) : (
  <Link
    href="/auth/login"
    className="rounded-md border px-3 py-2 text-sm"
  >
    Login
  </Link>
)}
      </div>

      <div className="px-3 pb-3 md:hidden">
        <div className="flex overflow-hidden rounded-md border">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-3 py-2 text-sm outline-none"
          />
          <button className="bg-orange-600 px-4 text-white">
            <Search size={18} />
          </button>
        </div>
      </div>

      <nav className="border-t">
        <div className="mx-auto flex max-w-7xl gap-4 overflow-x-auto px-3 py-2 text-sm">
          <Link href="/" className="text-orange-600 font-medium">Home</Link>
          <Link href="/products">Shop</Link>
          <Link href="/offer-products">Offers</Link>
          <Link href="/track-order">Track Order</Link>
          <Link href="/about-us">About</Link>
          <Link href="/contact-us">Contact</Link>
        </div>
      </nav>
    </header>
  );
}