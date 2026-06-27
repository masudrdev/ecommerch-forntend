import api from "@/lib/axios";

export const vendorService = {
  getDashboard: async () => {
    const res = await api.get("/vendors/dashboard");
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get("/vendors/me");
    return res.data;
  },

  getOrders: async ({ page = 1, limit = 10, search = "", status = "ALL" } = {}) => {
    const res = await api.get("/orders/vendor", {
      params: { page, limit, search, status },
    });
    return res.data;
  },

  getOrderDetails: async (orderId) => {
    const res = await api.get(`/orders/vendor/${orderId}`);
    return res.data;
  },

  updateOrderItemStatus: async (itemId, itemStatus) => {
    const res = await api.patch(`/orders/vendor/items/${itemId}/status`, {
      itemStatus,
    });
    return res.data;
  },
};