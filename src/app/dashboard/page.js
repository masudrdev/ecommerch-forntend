"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Clock,
  CheckCircle,
  Wallet,
  Plus,
} from "lucide-react";
import { ROLES } from "@/constants/roles";
import { dashboardService } from "@/services/dashboard.service";
import { vendorService } from "@/services/vendor.service";
import { getMyOrdersApi } from "@/services/order.service";

function money(value) {
  return `৳${Number(value || 0).toLocaleString("en-BD")}`;
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#1E293B] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            {value}
          </h2>
        </div>

        <div className="rounded-xl bg-blue-600/20 p-3 text-blue-400">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

function VendorOverview({ stats }) {
  const cards = [
    {
      title: "Total Products",
      value: stats.totalProducts || 0,
      icon: Package,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders || 0,
      icon: ShoppingCart,
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders || 0,
      icon: Clock,
    },
    {
      title: "Completed Orders",
      value: stats.completedOrders || 0,
      icon: CheckCircle,
    },
    {
      title: "Total Sales",
      value: money(stats.totalSales),
      icon: Wallet,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Vendor Dashboard</h1>
          <p className="mt-1 text-sm text-gray-400">
            Manage products, orders, stock and sales.
          </p>
        </div>

        <Link
          href="/dashboard/products/add"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-[#1E293B] p-5">
          <h2 className="text-lg font-bold text-white">Quick Actions</h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link
              href="/dashboard/products"
              className="rounded-lg bg-[#334155] p-4 text-sm font-semibold text-white hover:bg-[#475569]"
            >
              Manage Products
            </Link>

            <Link
              href="/dashboard/orders"
              className="rounded-lg bg-[#334155] p-4 text-sm font-semibold text-white hover:bg-[#475569]"
            >
              Manage Orders
            </Link>

            <Link
              href="/dashboard/payouts"
              className="rounded-lg bg-[#334155] p-4 text-sm font-semibold text-white hover:bg-[#475569]"
            >
              View Payouts
            </Link>

            <Link
              href="/dashboard/profile"
              className="rounded-lg bg-[#334155] p-4 text-sm font-semibold text-white hover:bg-[#475569]"
            >
              Shop Profile
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#1E293B] p-5">
          <h2 className="text-lg font-bold text-white">Insights</h2>

          <div className="mt-4 space-y-3 text-sm text-gray-300">
            <p>
              Pending orders:{" "}
              <span className="font-bold text-orange-400">
                {stats.pendingOrders || 0}
              </span>
            </p>

            <p>
              Completed orders:{" "}
              <span className="font-bold text-green-400">
                {stats.completedOrders || 0}
              </span>
            </p>

            <p>
              Total sales:{" "}
              <span className="font-bold text-blue-400">
                {money(stats.totalSales)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomerOverview({ stats, orders }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Customer Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">Welcome back.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Orders" value={stats.totalOrders || 0} icon={ShoppingCart} />
        <StatCard title="Pending Orders" value={stats.pendingOrders || 0} icon={Clock} />
        <StatCard title="Delivered Orders" value={stats.deliveredOrders || 0} icon={CheckCircle} />
        <StatCard title="Wishlist Items" value={stats.wishlistItems || 0} icon={Package} />
      </div>

      <div className="rounded-xl border border-white/10 bg-[#1E293B] p-5">
        <h2 className="text-lg font-bold text-white">Recent Orders</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="pb-3">Order</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b border-white/5">
                  <td className="py-4 text-white">{order.orderNumber || order.id}</td>
                  <td className="py-4 text-gray-300">
                    {new Date(order.createdAt).toLocaleDateString("en-BD")}
                  </td>
                  <td className="py-4 text-gray-300">{money(order.totalAmount)}</td>
                  <td className="py-4 text-orange-400">{order.orderStatus}</td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-400">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useSelector((state) => state.auth);

  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = user?.role || ROLES.CUSTOMER;

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.role) return;

      try {
        setLoading(true);

        if (role === ROLES.VENDOR) {
          const res = await vendorService.getDashboard();
          setStats(res?.dashboard || {});
        } else if (role === ROLES.CUSTOMER) {
          const res = await dashboardService.getCustomerDashboard();
          const orderRes = await getMyOrdersApi();

          setStats(res?.dashboard || {});
          setOrders(orderRes?.orders || []);
        } else {
          const res = await dashboardService.getAdminDashboard();
          setStats(res?.dashboard || {});
        }
      } catch (error) {
        console.error(error);
        setStats({});
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role, user?.role]);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-28 animate-pulse rounded-xl bg-[#1E293B]"
          />
        ))}
      </div>
    );
  }

  if (role === ROLES.VENDOR) {
    return <VendorOverview stats={stats} />;
  }

  return <CustomerOverview stats={stats} orders={orders} />;
}