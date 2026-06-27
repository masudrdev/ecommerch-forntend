"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

function Badge({ children }) {
  return (
    <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400">
      {children}
    </span>
  );
}

export default function DashboardProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("/placeholder.png");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/products/manage/${id}`);
        const data = res?.data?.product || res?.data?.data || res?.data;

        setProduct(data);

        const firstImage =
          data?.images?.find((img) => img?.isMain)?.url ||
          data?.images?.[0]?.url ||
          data?.mainImage ||
          "/placeholder.png";

        setMainImage(firstImage);
      } catch (error) {
        console.error("Product details fetch error:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="text-white">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="rounded-xl bg-[#1E293B] p-6 text-center text-gray-300">
        Product not found.
      </div>
    );
  }

  const images = product?.images || [];
  const variants = product?.variants || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{product.name}</h1>
          <p className="mt-1 text-sm text-gray-400">
            Dashboard product details
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600"
          >
            Back
          </button>

          <Link
            href={`/dashboard/products/${product.id}/edit`}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Edit Product
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-[#1E293B] p-5">
          <div className="relative h-[360px] w-full overflow-hidden rounded-xl bg-slate-800">
            <Image
              src={mainImage}
              alt={product.name || "Product image"}
              fill
              className="object-contain p-3"
            />
          </div>

          {images.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {images.map((img) => (
                <button
                  key={img.id || img.url}
                  onClick={() => setMainImage(img.url)}
                  className="relative h-20 w-20 overflow-hidden rounded-lg border border-slate-700 bg-slate-800"
                >
                  <Image
                    src={img.url}
                    alt={product.name || "Product image"}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl bg-[#1E293B] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Product Info</h2>
            <Badge>{product.status || "N/A"}</Badge>
          </div>

          <div className="space-y-3 text-sm">
            <Info label="Product ID" value={product.id} />
            <Info label="Slug" value={product.slug} />
            <Info label="SKU" value={product.sku || "-"} />
            <Info label="Category" value={product.category?.name || "-"} />
            <Info label="Brand" value={product.brand?.name || "-"} />
            <Info label="Vendor" value={product.vendor?.shopName || "-"} />
            <Info label="Price" value={`৳${product.price || 0}`} />
            <Info label="Offer Price" value={`৳${product.offerPrice || 0}`} />
            <Info label="Stock" value={product.stock ?? "-"} />
            <Info label="Sold" value={product.sold ?? 0} />
            <Info
              label="Created"
              value={
                product.createdAt
                  ? new Date(product.createdAt).toLocaleString("en-BD")
                  : "-"
              }
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-[#1E293B] p-5">
        <h2 className="mb-3 text-lg font-bold text-white">Description</h2>
        <p className="whitespace-pre-line text-sm leading-7 text-gray-300">
          {product.description || "No description available."}
        </p>
      </div>

      <div className="rounded-xl bg-[#1E293B] p-5">
        <h2 className="mb-4 text-lg font-bold text-white">Variants</h2>

        {variants.length === 0 ? (
          <p className="text-sm text-gray-400">No variants found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-gray-400">
                  <th className="pb-3">Color</th>
                  <th className="pb-3">Size</th>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3">Price</th>
                </tr>
              </thead>

              <tbody>
                {variants.map((variant) => (
                  <tr key={variant.id} className="border-b border-slate-800">
                    <td className="py-3 text-gray-300">
                      {variant.color || "-"}
                    </td>
                    <td className="py-3 text-gray-300">
                      {variant.size || "-"}
                    </td>
                    <td className="py-3 text-gray-300">
                      {variant.stock ?? "-"}
                    </td>
                    <td className="py-3 text-gray-300">
                      ৳{variant.price || product.price || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-700 pb-2">
      <span className="text-gray-400">{label}</span>
      <span className="text-right font-medium text-white">{value}</span>
    </div>
  );
}