import axiosInstance from "@/lib/axiosInstance";

export const createReviewApi = async (payload) => {
  const res = await axiosInstance.post("/reviews", payload);
  return res.data;
};

export const getMyReviewsApi = async () => {
  const res = await axiosInstance.get("/reviews/my-reviews");
  return res.data;
};

export const updateReviewApi = async (id, payload) => {
  const res = await axiosInstance.patch(`/reviews/${id}`, payload);
  return res.data;
};

export const deleteReviewApi = async (id) => {
  const res = await axiosInstance.delete(`/reviews/${id}`);
  return res.data;
};

export const getVendorReviewsApi = async (params = {}) => {
  const res = await axiosInstance.get("/reviews/vendor", { params });
  return res.data;
};

export const getVendorProductReviewsApi = async (productId) => {
  const res = await axiosInstance.get(`/reviews/vendor/${productId}`);
  return res.data;
};

export const replyVendorReviewApi = async (reviewId, reply) => {
  const res = await axiosInstance.patch(`/reviews/vendor/reply/${reviewId}`, {
    reply,
  });
  return res.data;
};