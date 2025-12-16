import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "./Layout/AdminLayout";
import { SidebarProvider } from "./components/ui/sidebar";
import ProtAuth from "./Auth/ProtAuth";
import LoginAdmin from "./Pages/Autherzation/LoginAdmin";
import NotFound from "./Pages/NotFound";
import ProtectedRoute from "./Auth/ProtectedRoute"; // Ensure this import is correct
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
import JobSubTitle from "./Pages/Admin/Setting/JobSubTitle/JobSubTitle";
import AddJobSubTitle from "./Pages/Admin/Setting/JobSubTitle/AddJobSubCategory";
import Articles from "./Pages/Admin/Articles/Articles";
import AddArticles from "./Pages/Admin/Articles/AddArticles";
import Roles from "./Pages/Admin/Roles/Roles";
import AddRoles from "./Pages/Admin/Roles/AddRoles";
import AdminUsers from "./Pages/Admin/Setting/AdminsUsers/AdminUsers";
import AddAdminUsers from "./Pages/Admin/Setting/AdminsUsers/AddAdminUsers";

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
        handle: { permission: "" } // Dashboard, no permission needed
      },
      {
        path: "users",
        children: [
          { index: true, element: <UserManagement />, handle: { permission: "users" } },
          { path: "add", element: <AddUser />, handle: { permission: "users" } },
        ],
      },
      {
        path: "requests",
        children: [
          { index: true, element: <Requests />, handle: { permission: "Pending Employeer" } },
        ],
      },
      {
        path: "contact_request",
        children: [
          { index: true, element: <ContactRequest />, handle: { permission: "ContactsRequest" } },
        ],
      },
      {
        path: "pending_payment",
        children: [
          { index: true, element: <PendingPayment />, handle: { permission: "pendingPyament" } },
        ],
      },
      {
        path: "all_cv",
        children: [
          { index: true, element: <AllCV />, handle: { permission: "AllCvs" } },
        ],
      },
      {
        path: "reviews",
        children: [
          { index: true, element: <Reviews />, handle: { permission: "Reviews" } },
        ],
      },
      {
        path: "regions",
        children: [
          { index: true, element: <Regions />, handle: { permission: ["country", "city", "zone"] } }, // Any of these
          { path: "add_country", element: <AddCountry />, handle: { permission: "country" } },
          { path: "add_city", element: <AddCity />, handle: { permission: "city" } },
          { path: "add_zone", element: <AddZone />, handle: { permission: "zone" } },
        ],
      },
      {
        path: "plans",
        children: [
          { index: true, element: <Plans />, handle: { permission: "Plans" } },
          { path: "add", element: <AddPlans />, handle: { permission: "Plans" } },
        ],
      },
      {
        path: "job_management",
        children: [
          {
            path: "jobs",
            children: [
              { index: true, element: <JobsManagment />, handle: { permission: "JobOffer" } },
              { path: "add", element: <AddJob />, handle: { permission: "JobOffer" } },
            ],
          },
          {
            path: "add_job",
            children: [
              { index: true, element: <AddJob />, handle: { permission: "JobOffer" } },
            ],
          },
          {
            path: "job_category",
            children: [
              { index: true, element: <JobCategory />, handle: { permission: "jobCategory" } },
              { path: "add", element: <AddJobCategory />, handle: { permission: "jobCategory" } },
            ],
          },
          {
            path: "job_title",
            children: [
              { index: true, element: <JobTitle />, handle: { permission: "JobTittle" } },
              { path: "add", element: <AddJobTitle />, handle: { permission: "JobTittle" } },
            ],
          },
          {
            path: "job_sub_title",
            children: [
              { index: true, element: <JobSubTitle />, handle: { permission: "jobSubTitle" } },
              { path: "add", element: <AddJobSubTitle />, handle: { permission: "jobSubTitle" } },
            ],
          }
        ],
      },
      {
        path: "organization_management",
        children: [
          {
            path: "organizations",
            children: [
              { index: true, element: <CorporateManagement />, handle: { permission: "company" } },
              { path: "add", element: <AddCorporate />, handle: { permission: "company" } },
              { path: "employers/:id", element: <CompanyEmployers />, handle: { permission: "Admin For Company" } },
            ],
          },
          {
            path: "organization_type",
            children: [
              { index: true, element: <CompanyType />, handle: { permission: "CompanyType" } },
              { path: "add", element: <AddCompanyType />, handle: { permission: "CompanyType" } },
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
              { index: true, element: <Drug />, handle: { permission: "Drugs" } },
              { path: "add", element: <AddDrug />, handle: { permission: "Drugs" } },
            ],
          },
          {
            path: "drug_category",
            children: [
              { index: true, element: <DrugCategory />, handle: { permission: "Drug Category" } },
              { path: "add", element: <AddDrugCategory />, handle: { permission: "Drug Category" } },
            ],
          },
        ],
      },
      {
        path: "doctors",
        children: [
          { index: true, element: <Doctors />, handle: { permission: "Doctor List" } },
          { path: "add", element: <AddDoctors />, handle: { permission: "Doctor List" } },
        ],
      },
      {
        path: "setting",
        children: [
          {
            path: "payment_method",
            children: [
              { index: true, element: <PaymentMethod />, handle: { permission: "PaymentMethods" } },
              { path: "add", element: <AddPaymentMethod />, handle: { permission: "PaymentMethods" } },
            ],
          },
          {
            path: "specialization",
            children: [
              { index: true, element: <JobSpecialization />, handle: { permission: "specialization" } },
              { path: "add", element: <AddJobSpecialization />, handle: { permission: "specialization" } },
            ],
          },
          {
            path: "qualifications",
            children: [
              { index: true, element: <Qualifications />, handle: { permission: "JobQualification" } },
              { path: "add", element: <AddQualifications />, handle: { permission: "JobQualification" } },
            ],
          },
          {
            path: "roles",
            children: [
              { index: true, element: <Roles />, handle: { permission: "Admin roles" } },
              { path: "add", element: <AddRoles />, handle: { permission: "Admin roles" } },
            ],
          },
          {
            path: "admins_users",
            children: [
              { index: true, element: <AdminUsers />, handle: { permission: "Admin roles" } }, // Using "Admin roles" permission as placeholder/safe default
              { path: "add", element: <AddAdminUsers />, handle: { permission: "Admin roles" } },
            ],
          },
        ],
      },
      {
        path: "articles",
        children: [
          { index: true, element: <Articles />, handle: { permission: "Articles" } },
          { path: "add", element: <AddArticles />, handle: { permission: "Articles" } },
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