"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { productService } from "@/services/product.service";

function money(value) {
  return `৳${Number(value || 0).toLocaleString("en-BD")}`;
}

export default function VendorProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getVendorProducts();
      setProducts(res?.products || []);
    } catch (error) {
      console.error(error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;

    await productService.deleteProduct(id);
    fetchProducts();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-sm text-gray-400">Manage your shop products.</p>
        </div>

        <Link
          href="/dashboard/products/add"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-44 animate-pulse rounded-xl bg-[#1E293B]"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[#1E293B] p-8 text-center">
          <p className="text-gray-300">No products found.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:hidden">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-xl border border-white/10 bg-[#1E293B] p-4"
              >
                <div className="flex gap-3">
                  <img
                    src={product.images?.[0]?.url || "/placeholder.png"}
                    alt={product.name}
                    className="h-20 w-20 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <Link href={`/dashboard/products/${product.id}`}>
                      <h2 className="truncate font-semibold text-white hover:text-orange-400">
                        {product.name}
                      </h2>
                    </Link>
                    <p className="text-sm text-gray-400">
                      {product.category?.name || "No category"}
                    </p>
                    <p className="mt-1 font-bold text-blue-400">
                      {money(product.salePrice || product.price)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg bg-[#334155] p-2 text-gray-300">
                    Stock: <b className="text-white">{product.stock}</b>
                  </div>
                  <div className="rounded-lg bg-[#334155] p-2 text-gray-300">
                    Status: <b className="text-white">{product.status}</b>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Link
                    href={`/dashboard/products/${product.id}`}
                    className="flex items-center justify-center gap-2 rounded-lg bg-slate-600 px-3 py-2 text-sm text-white"
                  >
                    <Eye size={16} />
                    Details
                  </Link>

                  <Link
                    href={`/dashboard/products/${product.id}/edit`}
                    className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm text-white"
                  >
                    <Edit size={16} />
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm text-white"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto rounded-xl border border-white/10 bg-[#1E293B] md:block">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-white/5">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images?.[0]?.url || "/placeholder.png"}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <div>
                          <Link href={`/dashboard/products/${product.id}`}>
                            <p className="font-semibold text-white hover:text-orange-400">
                              {product.name}
                            </p>
                          </Link>
                          <p className="text-xs text-gray-400">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-gray-300">
                      {product.category?.name || "-"}
                    </td>
                    <td className="p-4 text-blue-400">
                      {money(product.salePrice || product.price)}
                    </td>
                    <td className="p-4 text-gray-300">{product.stock}</td>
                    <td className="p-4 text-orange-400">{product.status}</td>

                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/products/${product.id}`}
                          className="rounded-lg bg-slate-600 p-2 text-white hover:bg-slate-700"
                          title="Details"
                        >
                          <Eye size={16} />
                        </Link>

                        <Link
                          href={`/dashboard/products/${product.id}/edit`}
                          className="rounded-lg bg-green-600 p-2 text-white hover:bg-green-700"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>

                        <button
                          onClick={() => handleDelete(product.id)}
                          className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}