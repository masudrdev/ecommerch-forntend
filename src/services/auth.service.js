import api from "@/lib/axios";

export const authService = {
  login: async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    return data;
  },

  register: async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    return data;
  },

  verifyEmail: async (payload) => {
    const { data } = await api.post("/auth/verify-email", payload);
    return data;
  },

  resendVerificationCode: async (payload) => {
    const { data } = await api.post(
      "/auth/resend-verification-code",
      payload
    );
    return data;
  },

  forgotPassword: async (payload) => {
    const { data } = await api.post(
      "/auth/forgot-password",
      payload
    );
    return data;
  },

  verifyResetOtp: async (payload) => {
    const { data } = await api.post(
      "/auth/verify-reset-otp",
      payload
    );
    return data;
  },

  resetPassword: async (payload) => {
    const { data } = await api.post(
      "/auth/reset-password",
      payload
    );
    return data;
  },

  updatePassword: async (payload) => {
    const { data } = await api.patch(
      "/auth/update-password",
      payload
    );
    return data;
  },

  getMe: async () => {
    const { data } = await api.get("/auth/me");
    return data;
  },

  refreshToken: async () => {
    const { data } = await api.post("/auth/refresh-token");
    return data;
  },

  logout: async () => {
    const { data } = await api.post("/auth/logout");
    return data;
  },
};