"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { vendorService } from "@/services/vendor.service";

function StatusBadge({ status }) {
  const style = {
    PENDING: "bg-yellow-500/10 text-yellow-400",
    PARTIALLY_CONFIRMED: "bg-cyan-500/10 text-cyan-400",
    CONFIRMED: "bg-cyan-500/10 text-cyan-400",
    PARTIALLY_PROCESSING: "bg-blue-500/10 text-blue-400",
    PROCESSING: "bg-blue-500/10 text-blue-400",
    PARTIALLY_SHIPPED: "bg-purple-500/10 text-purple-400",
    SHIPPED: "bg-purple-500/10 text-purple-400",
    DELIVERED: "bg-green-500/10 text-green-400",
    COMPLETED: "bg-green-500/10 text-green-400",
    CANCELLED: "bg-red-500/10 text-red-400",
    RETURNED: "bg-red-500/10 text-red-400",
    REFUNDED: "bg-red-500/10 text-red-400",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        style[status] || "bg-gray-500/10 text-gray-400"
      }`}
    >
      {status || "N/A"}
    </span>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [role, setRole] = useState("");

  const [initialLoading, setInitialLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 10;

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const [totalOrders, setTotalOrders] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    try {
      setTableLoading(true);

      const user =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("user") || "{}")
          : {};

      setRole(user?.role || "");

      if (user?.role === "VENDOR") {
        const res = await vendorService.getOrders({
          page,
          limit,
          search,
          status,
        });

        setOrders(res?.orders || []);
        setTotalOrders(res?.totalOrders || 0);
        setTotalItems(res?.totalItems || 0);
        setTotalPages(res?.totalPages || 1);
      } else {
        const res = await api.get("/orders/my-orders");
        setOrders(res?.data?.orders || res?.data?.data || []);
      }
    } catch (error) {
      console.error("Orders fetch error:", error);
      setOrders([]);
    } finally {
      setTableLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchOrders();
  }, [page, search, status]);

  if (initialLoading) {
    return <div className="text-white">Loading orders...</div>;
  }

  const isVendor = role === "VENDOR";

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">
          {isVendor ? "Vendor Orders" : "My Orders"}
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          {isVendor
            ? "Manage only your own product orders. Customer details are hidden."
            : "View your order history and current order status."}
        </p>
      </div>

      {isVendor && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-[#1E293B] p-4">
            <p className="text-sm text-gray-400">Total Orders</p>
            <h3 className="mt-2 text-2xl font-bold text-white">
              {totalOrders}
            </h3>
          </div>

          <div className="rounded-xl bg-[#1E293B] p-4">
            <p className="text-sm text-gray-400">Total Items</p>
            <h3 className="mt-2 text-2xl font-bold text-white">
              {totalItems}
            </h3>
          </div>

          <div className="rounded-xl bg-[#1E293B] p-4">
            <p className="text-sm text-gray-400">Per Page</p>
            <h3 className="mt-2 text-2xl font-bold text-white">{limit}</h3>
          </div>
        </div>
      )}

      {isVendor && (
        <div className="rounded-xl bg-[#1E293B] p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-3">
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search Order No / Product"
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white outline-none"
              />

              <select
                value={status}
                onChange={(e) => {
                  setPage(1);
                  setStatus(e.target.value);
                }}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSearchInput("");
                setSearch("");
                setStatus("ALL");
                setPage(1);
              }}
              className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl bg-[#1E293B] p-5">
        {tableLoading && (
          <div className="mb-4 rounded-lg bg-slate-800 px-4 py-2 text-sm text-orange-400">
            Updating results...
          </div>
        )}

        {orders.length === 0 ? (
          <div className="rounded-lg bg-[#334155] p-6 text-center text-sm text-gray-300">
            No orders found.
          </div>
        ) : isVendor ? (
          <div className="space-y-5">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-gray-400">
                    <th className="pb-3">Image</th>
                    <th className="pb-3">Order No</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Products</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Vendor Total</th>
                    <th className="pb-3">Vendor Status</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => {
                    const image = order.image || "/placeholder.png";
                    const products = order.products || [];
                    const previewProducts = products.slice(0, 2);
                    const moreCount = Math.max(products.length - 2, 0);

                    return (
                      <tr
                        key={order.orderId}
                        className="border-b border-slate-800"
                      >
                        <td className="py-4">
                          <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-slate-800">
                            <Image
                              src={image}
                              alt="Product image"
                              fill
                              className="object-cover"
                            />
                          </div>
                        </td>

                        <td className="py-4 font-medium text-white">
                          #{order.orderNumber}
                        </td>

                        <td className="py-4 text-gray-300">
                          {new Date(order.createdAt).toLocaleString("en-BD")}
                        </td>

                        <td className="py-4">
                          <div className="space-y-1">
                            {previewProducts.map((product) => (
                              <div key={product.itemId}>
                                <Link
                                  href={`/dashboard/products/${product.productId}`}
                                  className="font-semibold text-blue-500 hover:text-orange-400"
                                >
                                  {product.name || "N/A"}
                                </Link>
                                <span className="ml-2 text-xs text-gray-400">
                                  × {product.quantity}
                                </span>
                              </div>
                            ))}

                            {moreCount > 0 && (
                              <Link
                                href={`/dashboard/orders/${order.orderId}`}
                                className="text-xs font-semibold text-orange-400 hover:text-orange-300"
                              >
                                +{moreCount} more
                              </Link>
                            )}
                          </div>
                        </td>

                        <td className="py-4 text-gray-300">
                          {order.itemCount} Items
                        </td>

                        <td className="py-4 font-semibold text-white">
                          ৳{order.vendorTotal}
                        </td>

                        <td className="py-4">
                          <StatusBadge status={order.vendorStatus} />
                        </td>

                        <td className="py-4">
                          <Link
                            href={`/dashboard/orders/${order.orderId}`}
                            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <div className="text-sm text-gray-300">
                Page <span className="font-bold text-white">{page}</span> of{" "}
                <span className="font-bold text-white">{totalPages}</span>
              </div>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-gray-400">
                  <th className="pb-3">Order No</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-800">
                    <td className="py-4 font-medium text-white">
                      #{order.orderNumber}
                    </td>

                    <td className="py-4 text-gray-300">
                      {new Date(order.createdAt).toLocaleString("en-BD")}
                    </td>

                    <td className="py-4 font-semibold text-white">
                      ৳{order.totalAmount}
                    </td>

                    <td className="py-4 text-gray-300">
                      {order.paymentMethod || "COD"}
                    </td>

                    <td className="py-4">
                      <StatusBadge status={order.orderStatus} />
                    </td>

                    <td className="py-4">
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                      >
                        Details
                      </Link>
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