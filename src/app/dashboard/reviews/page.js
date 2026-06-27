"use client";

import { useEffect, useState } from "react";
import {
  getMyReviewsApi,
  updateReviewApi,
  deleteReviewApi,
} from "@/services/review.service";

function Stars({ rating }) {
  return (
    <div className="text-orange-400">
      {"★".repeat(rating || 0)}
      <span className="text-gray-600">{"★".repeat(5 - (rating || 0))}</span>
    </div>
  );
}

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await getMyReviewsApi();
      setReviews(res?.reviews || res?.data || []);
    } catch (error) {
      console.error("My reviews error:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmDelete) return;

    try {
      await deleteReviewApi(id);
      fetchReviews();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to delete review");
    }
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-bold text-white">My Reviews</h1>
        <div className="h-64 animate-pulse rounded-xl bg-[#1E293B]" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">My Reviews</h1>
        <p className="mt-1 text-sm text-gray-400">
          View, edit and delete your product reviews.
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-xl bg-[#1E293B] p-6 text-center text-sm text-gray-300">
          You have not reviewed any product yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl bg-[#1E293B] p-5 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-semibold text-white">
                    {review.product?.name || "Product"}
                  </h2>

                  <div className="mt-2">
                    <Stars rating={review.rating} />
                  </div>

                  <p className="mt-3 text-sm text-gray-300">
                    {review.comment}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(review)}
                    className="rounded-lg bg-blue-500 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(review.id)}
                    className="rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={handleUpdate}
            className="w-full max-w-lg rounded-xl bg-[#1E293B] p-5 shadow-xl"
          >
            <h2 className="text-lg font-bold text-white">Edit Review</h2>

            <div className="mt-5 space-y-4">
              <select
                value={editRating}
                onChange={(e) => setEditRating(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-3 text-white outline-none focus:border-orange-500"
              >
                <option value="5">5 Star - Excellent</option>
                <option value="4">4 Star - Good</option>
                <option value="3">3 Star - Average</option>
                <option value="2">2 Star - Poor</option>
                <option value="1">1 Star - Bad</option>
              </select>

              <textarea
                rows={5}
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-3 text-white outline-none focus:border-orange-500"
              />

              <div className="flex gap-3">
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
            </div>
          </form>
        </div>
      )}
    </div>
  );
}