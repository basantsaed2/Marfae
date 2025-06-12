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
import Regions from "./Pages/Admin/Regions/Regions";
import AddCountry from "./Pages/Admin/Regions/AddCountry";
import AddCity from "./Pages/Admin/Regions/AddCity";
import AddZone from "./Pages/Admin/Regions/AddZone";
import JobCategory from "./Pages/Admin/Setting/JobCategory/JobCategory";
import AddJobCategory from "./Pages/Admin/Setting/JobCategory/AddJobCategory";
import JobSpecialization from "./Pages/Admin/Setting/Specializations/JobSpecializations";
import AddJobSpecialization from "./Pages/Admin/Setting/Specializations/AddJobSpecializations";

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
        path: "regions",
        children: [
          { index: true, element: <Regions /> },
          { path: "add_country", element: <AddCountry /> },
          { path: "add_city", element: <AddCity /> },
          { path: "add_zone", element: <AddZone /> },
        ],
      },
       {
        path: "job_category",
        children: [
          { index: true, element: <JobCategory /> },
          { path: "add", element: <AddJobCategory /> },
        ],
      },
      {
        path: "specialization",
        children: [
          { index: true, element: <JobSpecialization /> },
          { path: "add", element: <AddJobSpecialization /> },
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
