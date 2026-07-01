
"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import { addToWishlistApi } from "@/services/wishlist.service";

export default function ProductCard({ product }) {
  const id = product?.id || product?._id;

  const image =
    product?.mainImage ||
    product?.image ||
    product?.images?.[0]?.url ||
    product?.images?.[0]?.imageUrl ||
    product?.images?.[0] ||
    "/placeholder.png";

  const price =
    product?.salePrice ||
    product?.offerPrice ||
    product?.finalPrice ||
    product?.price ||
    0;

  const oldPrice =
    product?.salePrice || product?.offerPrice
      ? product?.price
      : product?.oldPrice;

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!id) {
      toast.error("Product not found");
      return;
    }

    try {
      await addToWishlistApi(id);
      toast.success("Added to wishlist");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to add wishlist"
      );
    }
  };

  return (
    <div className="group overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md">
      <Link
        href={`/products/${product?.slug || id}`}
        className="relative block aspect-square bg-gray-100"
      >
        <Image
          src={image}
          alt={product?.name || "Product image"}
          fill
          className="object-cover p-2 transition group-hover:scale-105"
        />

        {product?.offerPrice && (
          <span className="absolute left-2 top-2 rounded bg-orange-600 px-2 py-1 text-xs text-white">
            Offer
          </span>
        )}
      </Link>

      <div className="p-3">
        <div className="mb-1 flex justify-between gap-2">
          <Link
            href={`/products/${product?.slug || id}`}
            className="line-clamp-2 text-sm font-medium"
          >
            {product?.name}
          </Link>

          <button
            type="button"
            onClick={handleAddToWishlist}
            className="rounded-full p-1 text-gray-500 hover:bg-orange-50 hover:text-orange-600"
          >
            <Heart size={17} />
          </button>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="font-bold text-orange-600">৳{price}</span>

          {oldPrice && (
            <span className="text-xs text-gray-400 line-through">
              ৳{oldPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}