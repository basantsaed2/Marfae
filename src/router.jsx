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
import AddUser from "./Pages/Admin/UserManagment/AddUser";
import CompanyType from "./Pages/Admin/Setting/CompanyType/CompanyType";
import AddCompanyType from "./Pages/Admin/Setting/CompanyType/AddCompanyType";
import JobTitle from "./Pages/Admin/Setting/JobTitle/JobTitle";
import AddJobTitle from "./Pages/Admin/Setting/JobTitle/AddJobTitle";
import Drug from "./Pages/Admin/DrugsManagment/Drugs/Drug";
import AddDrug from "./Pages/Admin/DrugsManagment/Drugs/AddDrug";
import DrugCategory from "./Pages/Admin/DrugsManagment/DrugCategory/DrugCategory";
import AddDrugCategory from "./Pages/Admin/DrugsManagment/DrugCategory/AddDrugCategory";

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
        children: [
          { index: true, element: <UserManagement /> },
          { path: "add", element: <AddUser /> },
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

      // {
      //   path: "specialization",
      //   children: [
      //     { index: true, element: <JobSpecialization /> },
      //     { path: "add", element: <AddJobSpecialization /> },
      //   ],
      // },

      {
        path: "job_management",
        children: [
          {
            path: "jobs",
            children: [
              { index: true, element: <JobsManagment /> },
              { path: "add", element: <AddJob /> },
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
            path: "job_specialization",
            children: [
              { index: true, element: <JobSpecialization /> },
              { path: "add", element: <AddJobSpecialization /> },
            ],
          },
          {
            path: "job_title",
            children: [
              { index: true, element: <JobTitle /> },
              { path: "add", element: <AddJobTitle /> },
            ],
          },
        ],
      },

      {
        path: "company_management",
        children: [
          {
            path: "companies",
            children: [
              { index: true, element: <CorporateManagement /> },
              { path: "add", element: <AddCorporate /> },
            ],
          },
          {
            path: "company_type",
            children: [
              { index: true, element: <CompanyType /> },
              { path: "add", element: <AddCompanyType /> },
            ],
          },
        ],
      },

      {
        path: "drug_management",
        children: [
          {
            path: "drugs",
            children: [
              { index: true, element: <Drug /> },
              { path: "add", element: <AddDrug /> },
            ],
          },
          {
            path: "drug_category",
            children: [
              { index: true, element: <DrugCategory /> },
              { path: "add", element: <AddDrugCategory /> },
            ],
          },
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
