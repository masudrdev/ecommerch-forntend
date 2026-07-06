"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit, Eye, Plus, Trash2, Search } from "lucide-react";
import { productService } from "@/services/product.service";
import { vendorService } from "@/services/vendor.service";

function money(value) {
  return `৳${Number(value || 0).toLocaleString("en-BD")}`;
}

function getUserRole() {
  if (typeof window === "undefined") return "";

  try {
    const user =
      JSON.parse(localStorage.getItem("user") || "null") ||
      JSON.parse(localStorage.getItem("authUser") || "null");

    return user?.role || "";
  } catch {
    return "";
  }
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [status, setStatus] = useState("ALL");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });

  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  const fetchProducts = async () => {
    try {
      setLoading(true);

      let res;

      if (isAdmin) {
        res = await productService.getAdminProducts({
          search,
          categoryId,
          vendorId,
          status,
          sort,
          page,
          limit: 20,
        });

        setPagination(
          res?.pagination || {
            total: 0,
            page: 1,
            limit: 20,
            totalPages: 1,
          }
        );
      } else {
        res = await productService.getVendorProducts();
      }

      setProducts(res?.products || []);
    } catch (error) {
      console.error(error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    if (!isAdmin) return;

    try {
      const [catRes, vendorRes] = await Promise.all([
        productService.getCategories(),
        vendorService.getAllVendors(),
      ]);

      setCategories(catRes?.categories || catRes?.data || []);
      setVendors(vendorRes?.vendors || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setRole(getUserRole());
  }, []);

  useEffect(() => {
    if (!role) return;
    fetchProducts();
    fetchFilters();
  }, [role]);

  useEffect(() => {
    if (!isAdmin) return;
    setPage(1);
  }, [categoryId, vendorId, status, sort]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchProducts();
  }, [categoryId, vendorId, status, sort, page]);

  const handleSearch = () => {
    setPage(1);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;

    await productService.deleteProduct(id);
    fetchProducts();
  };

  const handleStatusChange = async (id, newStatus) => {
    if (!confirm(`Are you sure to ${newStatus} this product?`)) return;

    try {
      await productService.updateProductStatus(id, newStatus);
      fetchProducts();
    } catch (error) {
      alert(error?.response?.data?.message || "Status update failed");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-sm text-gray-400">
            {isAdmin
              ? "Manage all marketplace products."
              : "Manage your shop products."}
          </p>
        </div>

        {!isAdmin && (
          <Link
            href="/dashboard/products/add"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Product
          </Link>
        )}
      </div>

      {isAdmin && (
        <div className="grid gap-3 rounded-xl border border-white/10 bg-[#1E293B] p-4 md:grid-cols-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="Search by product name..."
            className="rounded-lg border border-white/10 bg-[#0F172A] px-4 py-2 text-sm text-white outline-none"
          />

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="rounded-lg border border-white/10 bg-[#0F172A] px-4 py-2 text-sm text-white outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
            className="rounded-lg border border-white/10 bg-[#0F172A] px-4 py-2 text-sm text-white outline-none"
          >
            <option value="">All Vendors</option>
            {vendors.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.shopName}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-white/10 bg-[#0F172A] px-4 py-2 text-sm text-white outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-white/10 bg-[#0F172A] px-4 py-2 text-sm text-white outline-none"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price_low">Price Low → High</option>
            <option value="price_high">Price High → Low</option>
            <option value="stock_low">Stock Low → High</option>
            <option value="stock_high">Stock High → Low</option>
          </select>

          <button
            onClick={handleSearch}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Search size={16} />
            Search
          </button>
        </div>
      )}

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
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#1E293B]">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  {isAdmin && <th className="p-4">Vendor</th>}
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

                    {isAdmin && (
                      <td className="p-4 text-gray-300">
                        {product.vendor?.shopName || "-"}
                      </td>
                    )}

                    <td className="p-4 text-blue-400">
                      {money(product.salePrice || product.price)}
                    </td>

                    <td className="p-4 text-gray-300">{product.stock || 0}</td>

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

                        {!isAdmin && (
                          <>
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
                          </>
                        )}

                        {isAdmin && product.status !== "APPROVED" && (
                          <button
                            onClick={() =>
                              handleStatusChange(product.id, "APPROVED")
                            }
                            className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white"
                          >
                            Approve
                          </button>
                        )}

                        {isAdmin && product.status !== "REJECTED" && (
                          <button
                            onClick={() =>
                              handleStatusChange(product.id, "REJECTED")
                            }
                            className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isAdmin && pagination.totalPages > 1 && (
            <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#1E293B] p-4 sm:flex-row">
              <p className="text-sm text-gray-400">
                Showing page {pagination.page} of {pagination.totalPages} —
                Total {pagination.total} products
              </p>

              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="rounded-lg bg-slate-600 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Prev
                </button>

                <span className="rounded-lg bg-[#0F172A] px-4 py-2 text-sm text-white">
                  {page}
                </span>

                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() =>
                    setPage((prev) =>
                      Math.min(prev + 1, pagination.totalPages)
                    )
                  }
                  className="rounded-lg bg-slate-600 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}