"use client";

import { useEffect, useState } from "react";
import { vendorService } from "@/services/vendor.service";

export default function VendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await vendorService.getAllVendors({ status, search });
      setVendors(res?.vendors || []);
    } catch (error) {
      console.error(error);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [status]);

  const handleStatusChange = async (id, newStatus) => {
    if (!confirm(`Are you sure to ${newStatus} this vendor?`)) return;

    try {
      await vendorService.updateVendorStatus(id, newStatus);
      fetchVendors();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Vendor status update failed");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Vendors</h1>
        <p className="text-sm text-slate-400">
          Manage marketplace vendors and approval status.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") fetchVendors();
            }}
            placeholder="Search vendor, email, phone..."
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white outline-none md:w-80"
          />

          <div className="flex gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white outline-none"
            >
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="SUSPENDED">Suspended</option>
            </select>

            <button
              onClick={fetchVendors}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-400">Loading vendors...</p>
        ) : vendors.length === 0 ? (
          <p className="text-slate-400">No vendors found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-700 text-slate-300">
                <tr>
                  <th className="py-3">Shop</th>
                  <th className="py-3">Owner</th>
                  <th className="py-3">Contact</th>
                  <th className="py-3">Products</th>
                  <th className="py-3">Orders</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="border-b border-slate-700">
                    <td className="py-3 text-white">
                      <div className="font-semibold">{vendor.shopName}</div>
                      <div className="text-xs text-slate-400">
                        {vendor.shopSlug}
                      </div>
                    </td>

                    <td className="py-3 text-slate-300">
                      {vendor.user?.name || "-"}
                    </td>

                    <td className="py-3 text-slate-300">
                      <div>{vendor.user?.email || "-"}</div>
                      <div className="text-xs text-slate-400">
                        {vendor.user?.phone || "-"}
                      </div>
                    </td>

                    <td className="py-3 text-slate-300">
                      {vendor._count?.products || 0}
                    </td>

                    <td className="py-3 text-slate-300">
                      {vendor._count?.orders || 0}
                    </td>

                    <td className="py-3">
                      <span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-white">
                        {vendor.status}
                      </span>
                    </td>

                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        {vendor.status !== "APPROVED" && (
                          <button
                            onClick={() =>
                              handleStatusChange(vendor.id, "APPROVED")
                            }
                            className="rounded bg-green-600 px-3 py-1 text-xs font-semibold text-white"
                          >
                            Approve
                          </button>
                        )}

                        {vendor.status !== "REJECTED" && (
                          <button
                            onClick={() =>
                              handleStatusChange(vendor.id, "REJECTED")
                            }
                            className="rounded bg-red-600 px-3 py-1 text-xs font-semibold text-white"
                          >
                            Reject
                          </button>
                        )}

                        {vendor.status !== "SUSPENDED" && (
                          <button
                            onClick={() =>
                              handleStatusChange(vendor.id, "SUSPENDED")
                            }
                            className="rounded bg-yellow-600 px-3 py-1 text-xs font-semibold text-white"
                          >
                            Suspend
                          </button>
                        )}
                      </div>
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