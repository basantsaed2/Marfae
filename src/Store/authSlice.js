// // src/redux/slices/authSlice.js
// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   user: JSON.parse(localStorage.getItem("admin")) || null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setUser: (state, action) => {
//       if (action.payload?.user?.role === "admin") {
//         state.user = action.payload;
//       }
//     },
//     logout: (state) => {
//       state.user = null;
//       localStorage.removeItem("admin");
//       localStorage.removeItem("token");
//     },
//   },
// });

// export const { setUser, logout } = authSlice.actions;
// export default authSlice.reducer;

// src/redux/slices/authSlice.js (UPDATED TO INCLUDE PERMISSIONS)
import { createSlice } from "@reduxjs/toolkit";

// Helper to safely extract permissions from the user object stored in localStorage
const getInitialPermissions = () => {
  try {
    const user = JSON.parse(localStorage.getItem("admin"));
    // Assuming permissions are stored directly in the 'user' object in localStorage
    return user?.permissions || [];
  } catch (error) {
    return [];
  }
};

const initialState = {
  user: JSON.parse(localStorage.getItem("admin")) || null,
  // NEW: Store permissions in Redux state for easy access
  permissions: getInitialPermissions(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      if (action.payload?.user?.role === "admin") {
        state.user = action.payload;
        // NEW: Save the permissions array from the login payload
        state.permissions = action.payload?.permissions || [];
      }
    },
    logout: (state) => {
      state.user = null;
      state.permissions = []; // Clear permissions on logout
      localStorage.removeItem("admin");
      localStorage.removeItem("token");
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
