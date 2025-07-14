// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("admin")) || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      if (action.payload?.user?.role === "admin") {
        state.user = action.payload;
      }
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("admin");
      localStorage.removeItem("token");
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
