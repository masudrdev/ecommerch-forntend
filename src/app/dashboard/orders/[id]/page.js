"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { vendorService } from "@/services/vendor.service";

const nextItemStatusMap = {
  PENDING: "CONFIRMED",
  CONFIRMED: "PROCESSING",
  PROCESSING: "SHIPPED",
};

function StatusBadge({ status }) {
  return (
    <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400">
      {status || "N/A"}
    </span>
  );
}

export default function VendorOrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [note, setNote] = useState("");
const [savingNote, setSavingNote] = useState(false);
const handleAddNote = async () => {
  if (!note.trim()) {
    alert("Please write a note first");
    return;
  }

  try {
    setSavingNote(true);

    await vendorService.addOrderNote(order.id, {
      note: note.trim(),
      noteType: "VENDOR_INTERNAL",
      visibleToCustomer: false,
    });

    alert("Note added successfully");
    setNote("");
    await fetchOrder();
  } catch (error) {
    alert(error?.response?.data?.message || "Note save failed");
  } finally {
    setSavingNote(false);
  }
};

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await vendorService.getOrderDetails(id);
      setOrder(res?.order || null);
    } catch (error) {
      console.error("Vendor order details error:", error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const handleStatusUpdate = async (itemId) => {
    const nextStatus = selectedStatus[itemId];

    if (!nextStatus) {
      alert("Please select a status first");
      return;
    }

    try {
      setUpdatingId(itemId);
      await vendorService.updateOrderItemStatus(itemId, nextStatus);
      await fetchOrder();
      setSelectedStatus((prev) => ({ ...prev, [itemId]: "" }));
    } catch (error) {
      alert(error?.response?.data?.message || "Status update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="text-white">Loading order...</div>;

  if (!order) {
    return (
      <div className="rounded-xl bg-[#1E293B] p-6 text-center text-gray-300">
        Order not found.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Order #{order.orderNumber}
          </h1>
          <p className="text-sm text-gray-400">
            {new Date(order.createdAt).toLocaleString("en-BD")}
          </p>
        </div>

        <button
          onClick={() => router.back()}
          className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white"
        >
          Back
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-[#1E293B] p-4">
          <p className="text-sm text-gray-400">Vendor Status</p>
          <div className="mt-2">
            <StatusBadge status={order.vendorStatus} />
          </div>
        </div>

        <div className="rounded-xl bg-[#1E293B] p-4">
          <p className="text-sm text-gray-400">Vendor Total</p>
          <h3 className="mt-2 text-2xl font-bold text-white">
            ৳{order.vendorTotal}
          </h3>
        </div>

        <div className="rounded-xl bg-[#1E293B] p-4">
          <p className="text-sm text-gray-400">Payment</p>
          <h3 className="mt-2 font-bold text-white">
            {order.paymentMethod || "COD"} / {order.paymentStatus || "UNPAID"}
          </h3>
        </div>
      </div>

      <div className="rounded-xl bg-[#1E293B] p-5">
        <h2 className="mb-4 text-lg font-bold text-white">Products</h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-gray-400">
                <th className="pb-3">Image</th>
                <th className="pb-3">Product</th>
                <th className="pb-3">Size</th>
                <th className="pb-3">Color</th>
                <th className="pb-3">Qty</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Subtotal</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Update Status</th>
              </tr>
            </thead>

            <tbody>
              {order.items?.map((item) => {
                const image =
                  item.product?.images?.[0]?.url || "/placeholder.png";

                const nextStatus = nextItemStatusMap[item.itemStatus];
                const selected = selectedStatus[item.id] || "";

                return (
                  <tr key={item.id} className="border-b border-slate-800">
                    <td className="py-4">
                      <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-slate-800">
                        <Image
                          src={image}
                          alt={item.product?.name || "Product image"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>

                    <td className="py-4">
                      <Link
                        href={`/dashboard/products/${item.product?.id}`}
                        className="font-semibold text-blue-500 hover:text-orange-400"
                      >
                        {item.product?.name || "N/A"}
                      </Link>
                    </td>

                    <td className="py-4 text-gray-300">{item.size || "-"}</td>
                    <td className="py-4 text-gray-300">{item.color || "-"}</td>
                    <td className="py-4 text-gray-300">{item.quantity}</td>
                    <td className="py-4 text-gray-300">৳{item.price}</td>

                    <td className="py-4 font-semibold text-white">
                      ৳{item.subtotal}
                    </td>

                    <td className="py-4">
                      <StatusBadge status={item.itemStatus} />
                    </td>

                    <td className="py-4">
                      {nextStatus ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={selected}
                            onChange={(e) =>
                              setSelectedStatus((prev) => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))
                            }
                            className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-xs font-semibold text-white outline-none"
                          >
                            <option value="">Select</option>
                            <option value={nextStatus}>{nextStatus}</option>
                          </select>

                          <button
                            disabled={updatingId === item.id || !selected}
                            onClick={() => handleStatusUpdate(item.id)}
                            className="rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {updatingId === item.id ? "Updating..." : "Update"}
                          </button>
                        </div>
                      ) : (
                        <button
                          disabled
                          className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-semibold text-gray-400"
                        >
                          Locked
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="rounded-xl bg-[#1E293B] p-5">
  <h2 className="mb-2 text-lg font-bold text-white">Add Note</h2>

  <p className="mb-4 text-sm text-gray-400">
    This note is for vendor/admin internal use only. Customer will not see it.
  </p>

  <textarea
    value={note}
    onChange={(e) => setNote(e.target.value)}
    rows={4}
    placeholder="Example: Packed, Ready, Courier waiting..."
    className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-sm text-white outline-none placeholder:text-gray-500"
  />

  <div className="mt-3 flex justify-end">
    <button
      onClick={handleAddNote}
      disabled={savingNote || !note.trim()}
      className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {savingNote ? "Saving..." : "Add Note"}
    </button>
  </div>
  <div className="rounded-xl bg-[#1E293B] p-5">
  <h2 className="mb-4 text-lg font-bold text-white">Order Timeline</h2>

  {order.timeline?.length ? (
    <div className="space-y-4">
      {order.timeline.map((item) => (
        <div key={item.id} className="border-l-2 border-orange-500 pl-4">
          <h3 className="text-sm font-bold text-white">{item.title}</h3>

          {item.details && (
            <p className="mt-1 text-sm text-gray-300">{item.details}</p>
          )}

          <p className="mt-1 text-xs text-gray-500">
            {item.user?.name || "System"} •{" "}
            {new Date(item.createdAt).toLocaleString("en-BD")}
          </p>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-sm text-gray-500">No timeline available yet.</p>
  )}
</div>
  {/* note section */}
  <div className="mt-5 space-y-3">
  <h3 className="text-sm font-bold text-white">Previous Notes</h3>

  {order.notes?.length ? (
    order.notes.map((item) => (
      <div
        key={item.id}
        className="rounded-lg border border-slate-700 bg-slate-800 p-3"
      >
        <p className="text-sm text-gray-200">{item.note}</p>
        <p className="mt-2 text-xs text-gray-500">
          {item.user?.name || "Vendor"} •{" "}
          {new Date(item.createdAt).toLocaleString("en-BD")}
        </p>
      </div>
    ))
  ) : (
    <p className="text-sm text-gray-500">No notes added yet.</p>
  )}
</div>
</div>
      </div>
    </div>
  );
}