import { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { HiOutlineUsers, HiOutlineOfficeBuilding, HiOutlineUserCircle } from "react-icons/hi";
import { CiLocationOn } from "react-icons/ci";
import { BriefcaseBusiness, Newspaper, Cog, ChevronDown, ChevronRight, SquareChartGantt, MonitorCog, FileCog } from "lucide-react";
import { BiCategory } from "react-icons/bi";
import { GiPill } from "react-icons/gi";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTranslation } from "react-i18next";
import { LuGrid2X2Plus } from "react-icons/lu";
import { PiSubtitlesLight } from "react-icons/pi";
import { LiaPillsSolid } from "react-icons/lia";
import { RiSecurePaymentFill } from "react-icons/ri";
import { BsBuildingGear } from "react-icons/bs";
import { IoIosGitPullRequest } from "react-icons/io";
import { MdPendingActions } from "react-icons/md";
import { PiReadCvLogo } from "react-icons/pi";
import { MdOutlineContactPhone } from "react-icons/md";
import { MdStarRate } from "react-icons/md";
import { MdOutlineAddToQueue } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { TbCategoryPlus } from "react-icons/tb";
import logo from "@/assets/Logo.jpeg"
import { usePermissionCheck } from '@/Hooks/usePermissionCheck';
import { MdOutlineLockPerson } from "react-icons/md";

// --- Define Navigation Items with Associated Permissions ---
const navItems = [
    { label: "Control Panel", to: "/", icon: <AiOutlineHome className="stroke-2" size={20} />, permission: "" },
    { label: "User Management", to: "/users", icon: <HiOutlineUsers className="stroke-2" size={20} />, permission: "users" },
    { label: "Requests", to: "/requests", icon: <IoIosGitPullRequest className="stroke-2" size={20} />, permission: "Pending Employeer" },
    { label: "Plans", to: "/plans", icon: <SquareChartGantt className="stroke-2" size={20} />, permission: "Plans" },
    { label: "Doctors", to: "/doctors", icon: <FaUserDoctor size={20} />, permission: "Doctor List" },
    { label: "Contact Requests", to: "/contact_request", icon: <MdOutlineContactPhone size={20} />, permission: "ContactsRequest" },
    { label: "Pending Payment", to: "/pending_payment", icon: <MdPendingActions size={20} />, permission: "pendingPyament" },
    { label: "CV List", to: "/all_cv", icon: <PiReadCvLogo size={20} />, permission: "AllCvs" },
    { label: "Reviews", to: "/reviews", icon: <MdStarRate size={20} />, permission: "Reviews" },
    { label: "Articles", to: "/articles", icon: <Newspaper size={20} />, permission: "Articles" },
    { label: "Governorates and Regions", to: "/regions", icon: <CiLocationOn className="stroke-1" size={20} />, permission: ["country", "city", "zone"] },
    {
        label: "Job Management",
        icon: <BriefcaseBusiness size={20} />,
        permission: ["JobOffer", "jobCategory", "JobTittle", "jobSubTitle"],
        subItems: [
            { label: "Jobs", to: "/job_management/jobs", icon: <MonitorCog size={20} />, permission: "JobOffer" },
            { label: "Add Job", to: "/job_management/add_job", icon: <MdOutlineAddToQueue size={20} />, permission: "JobOffer" },
            { label: "Job Category", to: "/job_management/job_category", icon: <BiCategory size={20} />, permission: "jobCategory" },
            { label: "Job Title", to: "/job_management/job_title", icon: <PiSubtitlesLight className="stroke-1" size={20} />, permission: "JobTittle" },
            { label: "Job Sub Title", to: "/job_management/job_sub_title", icon: <TbCategoryPlus size={20} />, permission: "jobSubTitle" },
        ],
    },
    {
        label: "Organization",
        icon: <BsBuildingGear size={20} />,
        permission: ["company", "CompanyType"],
        subItems: [
            { label: "Organizations", to: "/organization_management/organizations", icon: <HiOutlineOfficeBuilding size={20} />, permission: "company" },
            { label: "Organization Type", to: "/organization_management/organization_type", icon: <LuGrid2X2Plus size={20} />, permission: "CompanyType" },
        ],
    },
    {
        label: "Drugs Management",
        icon: <LiaPillsSolid size={20} />,
        permission: ["Drugs", "Drug Category"],
        subItems: [
            { label: "Drugs", to: "/drug_management/drugs", icon: <GiPill className="stroke-1" size={20} />, permission: "Drugs" },
            { label: "Drugs Category", to: "/drug_management/drug_category", icon: <BiCategory size={20} />, permission: "Drug Category" },
        ],
    },
    {
        label: "Settings",
        icon: <Cog className="stroke-2" size={20} />,
        permission: ["PaymentMethods", "specialization", "JobQualification", "Admin roles"],
        subItems: [
            { label: "Payment Method", to: "/setting/payment_method", icon: <RiSecurePaymentFill size={20} />, permission: "PaymentMethods" },
            { label: "Specialization", to: "/setting/specialization", icon: <HiOutlineUserCircle size={20} />, permission: "specialization" },
            { label: "Qualifications", to: "/setting/qualifications", icon: <FileCog size={20} />, permission: "JobQualification" },
            { label: "Roles", to: "/setting/roles", icon: <MdOutlineLockPerson size={20} />, permission: "Admin roles" },
            { label: "Admins", to: "/setting/admins_users", icon: <HiOutlineUsers size={20} />, permission: "Admin roles" },
        ],
    },
];


export function AdminSidebar() {
    const location = useLocation();
    const { i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";
    const { hasPermission } = usePermissionCheck();

    const [expandedItems, setExpandedItems] = useState({});

    // 1. Memoize the list of items the user can actually see (including parents with visible children)
    const visibleNavItems = useMemo(() => {
        return navItems.filter(item => {
            // --- THIS BLOCK CHECKS YOUR REQUIREMENT ---
            if (item.subItems) {
                // Check if ANY sub-item is visible (to avoid empty parents)
                return item.subItems.some(sub => hasPermission(sub.permission));
            }
            // For simple links, just check the parent permission
            return hasPermission(item.permission);
        });
    }, [hasPermission]);

    // 2. Function to check if a parent item contains the current active route
    const isParentActive = useCallback((item) => {
        if (!item?.subItems) return false;

        // Filter subItems based on permission before checking active state
        const visibleSubItems = item.subItems.filter(sub => hasPermission(sub.permission));

        return visibleSubItems.some((sub) => location.pathname.startsWith(sub.to));
    }, [location.pathname, hasPermission]);

    // 3. Set the initial expansion state based on the current active route (Optimized useEffect)
    useEffect(() => {
        const initialExpanded = {};
        visibleNavItems.forEach((item) => {
            // Only auto-expand if it's a parent and it's currently active
            if (item.subItems && isParentActive(item)) {
                initialExpanded[item.label] = true;
            }
        });

        // Use functional update for safe state comparison and prevent unnecessary re-renders
        setExpandedItems((prevExpanded) => {
            if (JSON.stringify(initialExpanded) === JSON.stringify(prevExpanded)) {
                return prevExpanded;
            }
            return initialExpanded;
        });
    }, [location.pathname, visibleNavItems, isParentActive]); // Dependencies are clean and correct

    // 4. Function to handle expansion toggle (Simplified and guaranteed to toggle)
    const toggleExpand = (label) => {
        setExpandedItems((prev) => {
            return {
                ...prev,
                [label]: !prev[label], // Always toggle the previous state
            };
        });
    };

    return (
        <Sidebar
            side={isRTL ? "right" : "left"}
            className="bg-white border-none sm:border-none overflow-x-hidden h-full shadow-lg transition-all duration-300 font-semibold"
        >
            <SidebarContent
                className="bg-white p-2 pb-5 text-white border-none overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                style={{
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                }}
            >
                <SidebarGroup>
                    <SidebarGroupLabel className="p-2 text-white flex items-center justify-center gap-3">
                        <img
                            src={logo}
                            alt={logo || "Marfae"}
                            className="w-dull h-24 object-cover border-2 border-white/30 hover:scale-105 transition-transform duration-200"
                        />
                    </SidebarGroupLabel>
                    <hr className="w-full border-white !mb-3" />

                    <SidebarGroupContent>
                        <SidebarMenu className="list-none p-0 rounded-md flex flex-col gap-3">
                            {visibleNavItems.map((item) => {

                                const isActive = (() => {
                                    if (item.to === "/") {
                                        return location.pathname === "/";
                                    } else if (item.subItems) {
                                        return isParentActive(item);
                                    } else if (item.to) {
                                        return location.pathname.startsWith(item.to);
                                    }
                                    return false;
                                })();

                                const isExpanded = !!expandedItems[item.label];

                                return (
                                    <SidebarMenuItem key={item.label}>
                                        {item.to && !item.subItems ? (
                                            <Link to={item.to}>
                                                <SidebarMenuButton
                                                    isActive={isActive}
                                                    className={`flex cursor-pointer bg-bgsidebar justify-between items-center gap-3 !p-2 text-bg-primary transition-all duration-200 text-lg font-semibold
                            ${isActive ? "shadow-md bg-bgsidebar" : "bg-white hover:bg-white hover:text-bg-primary"}`}
                                                >
                                                    <div className="flex items-center gap-3 text-bg-primary">
                                                        {item.icon}
                                                        <span>{item.label}</span>
                                                    </div>
                                                </SidebarMenuButton>
                                            </Link>
                                        ) : (
                                            <SidebarMenuButton
                                                onClick={() => toggleExpand(item.label)}
                                                isActive={isActive}
                                                className={`flex cursor-pointer justify-between items-center gap-3 !p-2 text-bg-primary transition-all duration-200 text-lg font-semibold
                          ${isActive ? "shadow-md bg-bgsidebar" : "bg-white hover:bg-white hover:text-bg-primary"}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {item.icon}
                                                    <span className="text-lg">{item.label}</span>
                                                </div>
                                                {item.subItems && (
                                                    <span>{isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>
                                                )}
                                            </SidebarMenuButton>
                                        )}

                                        {item.subItems && isExpanded && (
                                            <div className="!ml-6 mt-3 flex flex-col gap-1">
                                                {item.subItems.map((subItem) => {
                                                    // Permission check for sub item
                                                    if (subItem.permission && !hasPermission(subItem.permission)) {
                                                        return null;
                                                    }

                                                    const isSubActive = location.pathname.startsWith(subItem.to);
                                                    return (
                                                        <Link
                                                            to={subItem.to}
                                                            key={subItem.label}
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <SidebarMenuButton
                                                                isActive={isSubActive}
                                                                className={`flex cursor-pointer justify-start items-center gap-3 !px-4 !py-2 text-bg-primary transition-all duration-200 text-lg font-semibold
                                  ${isSubActive ? "shadow-md bg-bgsidebar" : "bg-white hover:bg-white hover:text-bg-primary"}`}
                                                            >
                                                                {subItem.icon}
                                                                <span className="text-lg">{subItem.label}</span>
                                                            </SidebarMenuButton>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}