"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import {
  deleteReviewApi,
  getMyReviewsApi,
  getVendorReviewsApi,
  replyVendorReviewApi,
  updateReviewApi,
} from "@/services/review.service";

function Stars({ rating }) {
  return (
    <span className="text-sm text-yellow-400">
      {"★".repeat(rating || 0)}
      <span className="text-slate-500">{"★".repeat(5 - (rating || 0))}</span>
    </span>
  );
}

export default function ReviewsPage() {
  const { user } = useSelector((state) => state.auth);

  const userRole = user?.role?.toUpperCase();
  const isVendor = userRole === "VENDOR";
  const isCustomer = userRole === "CUSTOMER";

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const [replyingReview, setReplyingReview] = useState(null);
  const [reply, setReply] = useState("");
const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [rating, setRating] = useState("");
  const [replyStatus, setReplyStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [replySubmitting, setReplySubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      if (!userRole) return;

      setLoading(true);

      let res;

      if (isVendor) {
        res = await getVendorReviewsApi({
          search,
          rating,
          replyStatus,
          page,
          limit: 10,
        });
      } else if (isCustomer) {
        res = await getMyReviewsApi();
      } else {
        setReviews([]);
        setPagination(null);
        return;
      }

      setReviews(res?.reviews || res?.data || []);
      setPagination(res?.pagination || null);
      setStats(res?.stats || null);
    } catch (error) {
      console.error("Reviews error:", error);
      setReviews([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole) {
      fetchReviews();
    }
  }, [userRole, rating, replyStatus, page, search]);

  const handleSearch = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setRating("");
    setReplyStatus("");
    setPage(1);
  };

  const openEdit = (review) => {
    setEditingReview(review);
    setEditRating(review.rating || 5);
    setEditComment(review.comment || "");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editComment.trim()) {
      alert("Please write your review");
      return;
    }

    try {
      await updateReviewApi(editingReview.id, {
        rating: Number(editRating),
        comment: editComment,
      });

      setEditingReview(null);
      fetchReviews();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to update review");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await deleteReviewApi(id);
      fetchReviews();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to delete review");
    }
  };

  const openReply = (review) => {
    if (!review?.id) {
      alert("Review ID missing");
      return;
    }

    setReplyingReview(review);
    setReply(review.vendorReply || "");

    setTimeout(() => {
      document.getElementById("vendor-reply-box")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

const handleVendorReply = async (e) => {
  e.preventDefault();

  if (!reply.trim()) {
    alert("Reply is required");
    return;
  }

  try {
    setReplySubmitting(true);

    await replyVendorReviewApi(replyingReview.id, reply);

    setReplyingReview(null);
    setReply("");
    fetchReviews();
  } catch (error) {
    alert(error?.response?.data?.message || "Failed to submit reply");
  } finally {
    setReplySubmitting(false);
  }
};

  return (
    <div className="space-y-5">
      {isVendor && stats && (
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
    <div className="rounded-xl bg-slate-900 p-4">
      <p className="text-sm text-slate-400">Total Reviews</p>
      <h3 className="mt-1 text-2xl font-bold text-white">
        {stats.totalReviews}
      </h3>
    </div>

    <div className="rounded-xl bg-slate-900 p-4">
      <p className="text-sm text-slate-400">Average Rating</p>
      <h3 className="mt-1 text-2xl font-bold text-white">
        {stats.averageRating} ⭐
      </h3>
    </div>

    <div className="rounded-xl bg-slate-900 p-4">
      <p className="text-sm text-slate-400">Replied</p>
      <h3 className="mt-1 text-2xl font-bold text-green-400">
        {stats.replied}
      </h3>
    </div>

    <div className="rounded-xl bg-slate-900 p-4">
      <p className="text-sm text-slate-400">Pending Reply</p>
      <h3 className="mt-1 text-2xl font-bold text-orange-400">
        {stats.unreplied}
      </h3>
    </div>

    <div className="rounded-xl bg-slate-900 p-4 sm:col-span-2 lg:col-span-4">
      <p className="mb-3 text-sm font-semibold text-white">
        Rating Summary
      </p>

      {[5, 4, 3, 2, 1].map((star) => (
        <div key={star} className="mb-2 flex items-center justify-between text-sm">
          <span className="text-slate-300">
            {"★".repeat(star)}{"☆".repeat(5 - star)}
          </span>
          <span className="font-semibold text-white">
            {stats.ratingBreakdown?.[star] || 0}
          </span>
        </div>
      ))}
    </div>
  </div>
)}

      {isVendor && (
        <div className="grid gap-3 rounded-xl bg-slate-900 p-4 sm:grid-cols-2 lg:grid-cols-5">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="Search product, customer, review"
            className="rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-sm text-white outline-none lg:col-span-2"
          />

          <button
            type="button"
            onClick={handleSearch}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Search
          </button>

          <select
            value={rating}
            onChange={(e) => {
              setRating(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-sm text-white outline-none"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Star</option>
            <option value="4">4 Star</option>
            <option value="3">3 Star</option>
            <option value="2">2 Star</option>
            <option value="1">1 Star</option>
          </select>

          <select
            value={replyStatus}
            onChange={(e) => {
              setReplyStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-sm text-white outline-none"
          >
            <option value="">All Reviews</option>
            <option value="replied">Replied</option>
            <option value="unreplied">Unreplied</option>
          </select>

          <button
            type="button"
            onClick={handleClearSearch}
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600 sm:col-span-2 lg:col-span-5"
          >
            Clear Filter
          </button>
        </div>
      )}

      {isVendor && replyingReview && (
        <div
          id="vendor-reply-box"
          className="rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5"
        >
          <h2 className="mb-1 text-lg font-semibold text-white">
            Reply to Review
          </h2>

          <p className="mb-4 text-sm text-slate-400">
            Product: {replyingReview.product?.name || "Product"}
          </p>

          <form onSubmit={handleVendorReply} className="space-y-4">
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={4}
              placeholder="Write vendor reply..."
              className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-3 text-white outline-none focus:border-orange-500"
            />

            <div className="flex flex-col gap-3 sm:flex-row">
  <button
  type="submit"
  disabled={replySubmitting}
  className="rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
>
  {replySubmitting ? "Submitting..." : "Submit Reply"}
</button>

              <button
                type="button"
                onClick={() => {
                  setReplyingReview(null);
                  setReply("");
                }}
                className="rounded-lg bg-slate-700 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="rounded-xl bg-slate-900 p-6 text-slate-300">
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-xl bg-slate-900 p-6 text-slate-300">
          No reviews found.
        </div>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-sm sm:p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold text-white sm:text-lg">
                    {review.product?.name || "Product"}
                  </h2>

                  {isVendor && (
                    <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                      Customer:{" "}
                      <span className="text-slate-200">
                        {review.user?.name ||
                          review.user?.username ||
                          "Customer"}
                      </span>
                    </p>
                  )}

                  <div className="mt-2">
                    <Stars rating={review.rating} />
                  </div>

                  <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-300">
                    {review.comment || "No comment"}
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleString()
                      : ""}
                  </p>

                  {review.vendorReply && (
                    <div className="mt-4 rounded-lg border border-orange-500/30 bg-orange-500/10 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-orange-300">
                        Vendor Reply
                      </p>
                      <p className="mt-1 whitespace-pre-wrap break-words text-sm text-orange-100">
                        {review.vendorReply}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 sm:justify-end">
                  {review.product?.slug && (
                    <Link
                      href={`/products/${review.product.slug}`}
                      className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-600"
                    >
                      View Product
                    </Link>
                  )}

                  {isVendor ? (
                    <button
                      type="button"
                      onClick={() => openReply(review)}
                      className="rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-600"
                    >
                      {review.vendorReply ? "Update Reply" : "Reply"}
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => openEdit(review)}
                        className="rounded-lg bg-blue-500 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(review.id)}
                        className="rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isVendor && pagination?.totalPages > 1 && (
        <div className="flex flex-col gap-3 rounded-xl bg-slate-900 p-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm text-white disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-center text-sm text-slate-300">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            type="button"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm text-white disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {!isVendor && editingReview && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
          <h2 className="mb-4 text-lg font-semibold text-white">Edit Review</h2>

          <form onSubmit={handleUpdate} className="space-y-4">
            <select
              value={editRating}
              onChange={(e) => setEditRating(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-3 text-white outline-none focus:border-orange-500"
            >
              <option value="5">5 Star - Excellent</option>
              <option value="4">4 Star - Good</option>
              <option value="3">3 Star - Good</option>
              <option value="2">2 Star - Poor</option>
              <option value="1">1 Star - Bad</option>
            </select>

            <textarea
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-3 text-white outline-none focus:border-orange-500"
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600"
              >
                Update Review
              </button>

              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="rounded-lg bg-slate-700 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}