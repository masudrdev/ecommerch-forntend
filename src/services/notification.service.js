import axiosInstance from "@/lib/axiosInstance";

export const getMyNotificationsApi = async () => {
  const res = await axiosInstance.get("/notifications");
  return res.data;
};

export const markNotificationAsReadApi = async (id) => {
  const res = await axiosInstance.patch(`/notifications/${id}/read`);
  return res.data;
};

export const markAllNotificationsAsReadApi = async () => {
  const res = await axiosInstance.patch("/notifications/read-all");
  return res.data;
};

export const deleteNotificationApi = async (id) => {
  const res = await axiosInstance.delete(`/notifications/${id}`);
  return res.data;
};