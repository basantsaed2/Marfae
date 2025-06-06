import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "./Layout/AdminLayout";
import { SidebarProvider } from "./components/ui/sidebar";
import ProtAuth from "./Auth/ProtAuth";
import LoginAdmin from "./components/Login/LoginAdmin";
import NotFound from "./Pages/NotFound";
import ProtectedRoute from "./Auth/ProtectedRoute";
import AuthLayout from "./Layout/AuthLayout";
import ControlPanel from "./Pages/Admin/ControlPanel/ControlPanel";
import UserManagement from "./Pages/Admin/UserManagment/UserManagment";
import JobsManagment from "./Pages/Admin/JobsManagment/JobsManagment";
import AddJob from "./Pages/Admin/JobsManagment/AddJob";
import CorporateManagement from "./Pages/Admin/CorporateManagement/CorporateManagement";
import AddCorporate from "./Pages/Admin/CorporateManagement/AddCorporate";

const router = createBrowserRouter([
  // ✅ صفحات تسجيل الدخول و auth layout
  {
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: (
          // <ProtAuth>
          <LoginAdmin />
          // </ProtAuth>
        ),
      },
    ],
  },

  // ✅ الصفحات المحمية داخل MainLayout
  {
    element: (
      <SidebarProvider>
        <AdminLayout />
      </SidebarProvider>
    ),
    children: [
      {
        path: "/",
        element: (
          // <ProtectedRoute>
          <ControlPanel />
          // </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: <UserManagement />,
      },
      {
        path: "jobs",
        children: [
          { index: true, element: <JobsManagment /> },
          { path: "add", element: <AddJob /> },
        ],
      },
      {
        path: "corporate",
        children: [
          { index: true, element: <CorporateManagement /> },
          { path: "add", element: <AddCorporate /> },
        ],
      },

      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
