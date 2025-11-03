import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "./Layout/AdminLayout";
import { SidebarProvider } from "./components/ui/sidebar";
import ProtAuth from "./Auth/ProtAuth";
import LoginAdmin from "./Pages/Autherzation/LoginAdmin";
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
import Plans from "./Pages/Admin/Plans/Plans";
import AddPlans from "./Pages/Admin/Plans/AddPlans";
import Requests from "./Pages/Admin/Requests/Request";
import PaymentMethod from "./Pages/Admin/PaymentMethod/PaymentMethod";
import AddPaymentMethod from "./Pages/Admin/PaymentMethod/AddPaymentMethod";
import PendingPayment from "./Pages/Admin/PendingPayment/PendingPayment";
import ContactRequest from "./Pages/Admin/ContactRequest/ContactRequest";
import AllCV from "./Pages/Admin/AllCV/AllCV";
import Reviews from "./Pages/Admin/Reviews/Reviews";
import CompanyEmployers from "./Pages/Admin/CorporateManagement/CompanyEmployers";
import Qualifications from "./Pages/Admin/Setting/Qualifications/Qualifications";
import AddQualifications from "./Pages/Admin/Setting/Qualifications/AddQualifications";
import Doctors from "./Pages/Admin/Doctors/Doctors";
import AddDoctors from "./Pages/Admin/Doctors/AddDoctors";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: (
          <ProtAuth>
            <LoginAdmin />
          </ProtAuth>
        ),
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <SidebarProvider>
          <AdminLayout />
        </SidebarProvider>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <ControlPanel />,
      },
      {
        path: "users",
        children: [
          { index: true, element: <UserManagement /> },
          { path: "add", element: <AddUser /> },
        ],
      },
      {
        path: "requests",
        children: [
          { index: true, element: <Requests /> },
        ],
      },
      {
        path: "contact_request",
        children: [
          { index: true, element: <ContactRequest /> },
        ],
      },
      {
        path: "pending_payment",
        children: [
          { index: true, element: <PendingPayment /> },
        ],
      },
      {
        path: "all_cv",
        children: [
          { index: true, element: <AllCV /> },
        ],
      },
      {
        path: "reviews",
        children: [
          { index: true, element: <Reviews /> },
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
        path: "plans",
        children: [
          { index: true, element: <Plans /> },
          { path: "add", element: <AddPlans /> },
        ],
      },
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
            path: "add_job",
            children: [
              { index: true, element: <AddJob /> },
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
            path: "job_title",
            children: [
              { index: true, element: <JobTitle /> },
              { path: "add", element: <AddJobTitle /> },
            ],
          },
        ],
      },
      {
        path: "organization_management",
        children: [
          {
            path: "organizations",
            children: [
              { index: true, element: <CorporateManagement /> },
              { path: "add", element: <AddCorporate /> },
              { path: "employers/:id", element: <CompanyEmployers /> }, // Add this route
            ],
          },
          {
            path: "organization_type",
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
        path: "doctors",
        children: [
          { index: true, element: <Doctors /> },
          { path: "add", element: <AddDoctors /> },
        ],
      },
      {
        path: "setting",
        children: [
          {
            path: "payment_method",
            children: [
              { index: true, element: <PaymentMethod /> },
              { path: "add", element: <AddPaymentMethod /> },
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
            path: "qualifications",
            children: [
              { index: true, element: <Qualifications /> },
              { path: "add", element: <AddQualifications /> },
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