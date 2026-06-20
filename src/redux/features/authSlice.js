import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken:
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
  isAuthenticated: false,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", action.payload.accessToken);
      }
    },

    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    logoutUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
      }
    },

    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setCredentials, setUser, logoutUser, setAuthLoading } =
  authSlice.actions;

export default authSlice.reducer;