// src/store/notificationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    totalMaintenance: 0,
    totalProblems: 0,
  },
  reducers: {
    setNotificationTotals: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setNotificationTotals } = notificationSlice.actions;
export default notificationSlice.reducer;