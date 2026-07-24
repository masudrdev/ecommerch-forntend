"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Eye,
  Loader2,
  Search,
  ShoppingCart,
  Wallet,
} from "lucide-react";

import api from "@/lib/axios";
import { vendorService } from "@/services/vendor.service";
import { getLoggedInUserRole } from "@/services/orderDetails.service";

function money(value) {
  return `৳${Number(value || 0).toLocaleString(
    "en-BD"
  )}`;
}

function getOrderImage(order) {
  const image =
    order?.image ||
    order?.products?.[0]?.image ||
    order?.items?.[0]?.product?.images?.[0]
      ?.url ||
    order?.items?.[0]?.product?.images?.[0] ||
    null;

  return typeof image === "string" &&
    image.trim()
    ? image
    : null;
}

function StatusBadge({ status }) {
  const normalizedStatus = String(
    status || "N/A"
  ).toUpperCase();

  const style = {
    PENDING:
      "bg-yellow-500/10 text-yellow-400",
    CONFIRMED:
      "bg-cyan-500/10 text-cyan-400",
    PARTIALLY_CONFIRMED:
      "bg-cyan-500/10 text-cyan-400",
    PROCESSING:
      "bg-blue-500/10 text-blue-400",
    PARTIALLY_PROCESSING:
      "bg-blue-500/10 text-blue-400",
    SHIPPED:
      "bg-purple-500/10 text-purple-400",
    PARTIALLY_SHIPPED:
      "bg-purple-500/10 text-purple-400",
    DELIVERED:
      "bg-green-500/10 text-green-400",
    COMPLETED:
      "bg-green-500/10 text-green-400",
    CANCELLED:
      "bg-red-500/10 text-red-400",
    RETURNED:
      "bg-red-500/10 text-red-400",
    REFUNDED:
      "bg-red-500/10 text-red-400",
    UNPAID:
      "bg-yellow-500/10 text-yellow-400",
    PAID:
      "bg-green-500/10 text-green-400",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        style[normalizedStatus] ||
        "bg-slate-500/10 text-slate-300"
      }`}
    >
      {normalizedStatus}
    </span>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] =
    useState(true);
  const [searching, setSearching] =
    useState(false);

  const [page, setPage] = useState(1);
  const limit = 10;

  const [searchInput, setSearchInput] =
    useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] =
    useState("ALL");
  const [paymentStatus, setPaymentStatus] =
    useState("ALL");
  const [sort, setSort] =
    useState("newest");

  const [pagination, setPagination] =
    useState({
      total: 0,
      page: 1,
      limit,
      totalPages: 1,
    });

  const isAdmin =
    role === "ADMIN" ||
    role === "SUPER_ADMIN";

  const isVendor = role === "VENDOR";
  const isCustomer = role === "CUSTOMER";

  useEffect(() => {
    setRole(getLoggedInUserRole() || "");
  }, []);

  useEffect(() => {
    if (!role) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);

        if (isVendor) {
          const response =
            await vendorService.getOrders({
              page,
              limit,
              search,
              status:
                status === "ALL"
                  ? ""
                  : status,
              sort,
            });

          const vendorOrders =
            response?.orders ||
            response?.data?.orders ||
            response?.data ||
            [];

          const safeOrders = Array.isArray(
            vendorOrders
          )
            ? vendorOrders
            : [];

          setOrders(safeOrders);

          setPagination({
            total:
              response?.totalOrders ||
              response?.pagination?.total ||
              safeOrders.length,
            page,
            limit,
            totalPages:
              response?.totalPages ||
              response?.pagination
                ?.totalPages ||
              1,
          });
        } else if (isAdmin) {
          const response = await api.get(
            "/orders/admin/all",
            {
              params: {
                page,
                limit,
                search,
                status:
                  status === "ALL"
                    ? ""
                    : status,
                paymentStatus:
                  paymentStatus === "ALL"
                    ? ""
                    : paymentStatus,
                sort,
              },
            }
          );

          const data =
            response?.data || {};

          setOrders(data?.orders || []);

          setPagination(
            data?.pagination || {
              total:
                data?.orders?.length || 0,
              page,
              limit,
              totalPages: 1,
            }
          );
        } else {
          const response = await api.get(
            "/orders/my-orders"
          );

          const customerOrders =
            response?.data?.orders ||
            response?.data?.data ||
            [];

          setOrders(
            Array.isArray(customerOrders)
              ? customerOrders
              : []
          );

          setPagination({
            total: Array.isArray(
              customerOrders
            )
              ? customerOrders.length
              : 0,
            page: 1,
            limit: 10,
            totalPages: 1,
          });
        }
      } catch (error) {
        console.error(
          "Orders fetch error:",
          error?.response?.data || error
        );

        setOrders([]);
      } finally {
        setLoading(false);
        setSearching(false);
      }
    };

    fetchOrders();
  }, [
    role,
    page,
    search,
    status,
    paymentStatus,
    sort,
    isVendor,
    isAdmin,
  ]);

  const handleSearch = () => {
    setSearching(true);
    setPage(1);
    setSearch(searchInput.trim());
  };

  const stats = useMemo(() => {
    const totalSales = orders.reduce(
      (sum, order) => {
        const orderStatus = String(
          order?.orderStatus ||
            order?.status ||
            order?.vendorStatus ||
            ""
        ).toUpperCase();

        if (
          [
            "DELIVERED",
            "COMPLETED",
          ].includes(orderStatus)
        ) {
          const amount = isVendor
            ? order?.vendorTotal ||
              order?.totalAmount
            : order?.totalAmount ||
              order?.vendorTotal;

          return sum + Number(amount || 0);
        }

        return sum;
      },
      0
    );

    return {
      totalOrders:
        pagination.total || orders.length,
      totalSales,
    };
  }, [
    orders,
    pagination.total,
    isVendor,
  ]);

  if (loading && orders.length === 0) {
    return (
      <div className="p-6 text-white">
        Loading orders...
      </div>
    );
  }

  // Customer UI আগের মতো simple থাকবে
  if (isCustomer) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            My Orders
          </h1>

          <p className="text-sm text-slate-400">
            View your order history and
            current order status.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#1E293B] p-5">
          {orders.length === 0 ? (
            <p className="text-slate-400">
              No orders found.
            </p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const orderId =
                  order?.id ||
                  order?.orderId;

                const orderStatus =
                  order?.orderStatus ||
                  order?.status ||
                  "PENDING";

                return (
                  <div
                    key={orderId}
                    className="flex flex-col gap-4 rounded-lg bg-[#0F172A] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-white">
                        #
                        {order?.orderNumber ||
                          orderId}
                      </p>

                      <p className="text-sm text-slate-400">
                        {order?.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleString(
                              "en-BD"
                            )
                          : "-"}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-white">
                        {money(
                          order?.totalAmount
                        )}
                      </p>

                      <StatusBadge
                        status={orderStatus}
                      />
                    </div>

                    <Link
                      href={`/dashboard/orders/${orderId}`}
                      className="rounded-lg bg-slate-700 px-4 py-2 text-center text-sm font-semibold text-white"
                    >
                      Details
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Admin এবং Vendor একই table UI
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          {isVendor
            ? "Vendor Orders"
            : "Orders"}
        </h1>

        <p className="text-sm text-slate-400">
          {isVendor
            ? "Manage your own product orders. Status can be updated up to SHIPPED."
            : "Manage all marketplace orders."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-[#1E293B] p-5">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-blue-600/20 p-3 text-blue-400">
              <ShoppingCart size={24} />
            </div>

            <div>
              <p className="text-sm text-slate-400">
                {isVendor
                  ? "My Orders"
                  : "Total Orders"}
              </p>

              <h3 className="text-2xl font-bold text-white">
                {stats.totalOrders}
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#1E293B] p-5">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-green-600/20 p-3 text-green-400">
              <Wallet size={24} />
            </div>

            <div>
              <p className="text-sm text-slate-400">
                {isVendor
                  ? "My Sales"
                  : "Total Sales"}
              </p>

              <h3 className="text-2xl font-bold text-white">
                {money(
                  stats.totalSales
                )}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#1E293B] p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
          <input
            value={searchInput}
            onChange={(event) =>
              setSearchInput(
                event.target.value
              )
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Search order/customer/phone..."
            className="rounded-lg border border-white/10 bg-[#0F172A] px-4 py-2 text-sm text-white outline-none"
          />

          <select
            value={status}
            onChange={(event) => {
              setPage(1);
              setStatus(
                event.target.value
              );
            }}
            className="rounded-lg border border-white/10 bg-[#0F172A] px-4 py-2 text-sm text-white outline-none"
          >
            <option value="ALL">
              All Status
            </option>
            <option value="PENDING">
              Pending
            </option>
            <option value="CONFIRMED">
              Confirmed
            </option>
            <option value="PROCESSING">
              Processing
            </option>
            <option value="SHIPPED">
              Shipped
            </option>

            {!isVendor && (
              <>
                <option value="DELIVERED">
                  Delivered
                </option>
                <option value="COMPLETED">
                  Completed
                </option>
              </>
            )}

            <option value="CANCELLED">
              Cancelled
            </option>
          </select>

          <select
            value={paymentStatus}
            disabled={isVendor}
            onChange={(event) => {
              setPage(1);
              setPaymentStatus(
                event.target.value
              );
            }}
            className="rounded-lg border border-white/10 bg-[#0F172A] px-4 py-2 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="ALL">
              All Payment
            </option>
            <option value="UNPAID">
              Unpaid
            </option>
            <option value="PAID">
              Paid
            </option>
          </select>

          <select
            value={sort}
            onChange={(event) => {
              setPage(1);
              setSort(
                event.target.value
              );
            }}
            className="rounded-lg border border-white/10 bg-[#0F172A] px-4 py-2 text-sm text-white outline-none"
          >
            <option value="newest">
              Newest
            </option>
            <option value="oldest">
              Oldest
            </option>
          </select>

          <button
            type="button"
            onClick={handleSearch}
            disabled={searching}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {searching ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Searching...
              </>
            ) : (
              <>
                <Search size={16} />
                Search
              </>
            )}
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1E293B]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="border-b border-white/10 text-slate-400">
              <tr>
                <th className="px-4 py-4">
                  Order
                </th>

                <th className="px-4 py-4">
                  Customer
                </th>

                {!isVendor && (
                  <th className="px-4 py-4">
                    Vendor
                  </th>
                )}

                <th className="px-4 py-4">
                  Amount
                </th>

                <th className="px-4 py-4">
                  Payment
                </th>

                <th className="px-4 py-4">
                  Status
                </th>

                <th className="px-4 py-4">
                  Date
                </th>

                <th className="px-4 py-4 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      isVendor ? 7 : 8
                    }
                    className="px-4 py-10 text-center text-slate-400"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const orderId =
                    order?.id ||
                    order?.orderId;

                  const customer =
                    order?.user ||
                    order?.customer ||
                    {};

                  const productImage =
                    getOrderImage(order);

                  const vendors = [
                    ...new Set(
                      (
                        order?.items || []
                      )
                        .map(
                          (item) =>
                            item?.vendor
                              ?.shopName ||
                            item?.product
                              ?.vendor
                              ?.shopName
                        )
                        .filter(Boolean)
                    ),
                  ];

                  const orderStatus =
                    order?.orderStatus ||
                    order?.status ||
                    order?.vendorStatus ||
                    "PENDING";

                  return (
                    <tr
                      key={orderId}
                      className="border-b border-white/10 text-white last:border-b-0 hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {productImage ? (
                            <Image
                              src={
                                productImage
                              }
                              alt="Order"
                              width={44}
                              height={44}
                              className="h-11 w-11 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-700 text-xs text-slate-400">
                              N/A
                            </div>
                          )}

                          <div>
                            <p className="font-semibold">
                              #
                              {order?.orderNumber ||
                                orderId}
                            </p>

                            <p className="text-xs text-slate-400">
                              {order?.items
                                ?.length ||
                                order?.itemCount ||
                                0}{" "}
                              item(s)
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-semibold">
                          {customer?.name ||
                            order?.customerName ||
                            "N/A"}
                        </p>

                        <p className="text-xs text-slate-400">
                          {customer?.phone ||
                            order?.phone ||
                            order
                              ?.shippingAddress
                              ?.phone ||
                            ""}
                        </p>
                      </td>

                      {!isVendor && (
                        <td className="px-4 py-4">
                          {vendors.length
                            ? vendors.join(
                                ", "
                              )
                            : "-"}
                        </td>
                      )}

                      <td className="px-4 py-4 font-semibold text-blue-400">
                        {money(
                          isVendor
                            ? order?.vendorTotal ||
                                order?.totalAmount
                            : order?.totalAmount ||
                                order?.vendorTotal
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <p>
                          {order?.paymentMethod ||
                            "COD"}
                        </p>

                        <StatusBadge
                          status={
                            order?.paymentStatus ||
                            "UNPAID"
                          }
                        />
                      </td>

                      <td className="px-4 py-4">
                        <StatusBadge
                          status={orderStatus}
                        />
                      </td>

                      <td className="px-4 py-4 text-slate-300">
                        {order?.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleString(
                              "en-BD"
                            )
                          : "-"}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end">
                          <Link
                            href={`/dashboard/orders/${orderId}`}
                            className="rounded-lg bg-slate-600 p-2 text-white hover:bg-slate-500"
                            title="View"
                          >
                            <Eye size={16} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#1E293B] p-4 md:flex-row">
        <p className="text-sm text-slate-400">
          Showing page {page} of{" "}
          {pagination.totalPages} — Total{" "}
          {pagination.total} orders
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() =>
              setPage((previous) =>
                Math.max(
                  previous - 1,
                  1
                )
              )
            }
            className="rounded-lg bg-slate-600 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            Prev
          </button>

          <span className="rounded-lg bg-[#0F172A] px-4 py-2 text-sm text-white">
            {page}
          </span>

          <button
            type="button"
            disabled={
              page >=
              pagination.totalPages
            }
            onClick={() =>
              setPage((previous) =>
                Math.min(
                  previous + 1,
                  pagination.totalPages
                )
              )
            }
            className="rounded-lg bg-slate-600 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}