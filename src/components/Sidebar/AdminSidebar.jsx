import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { HiOutlineUsers, HiOutlineOfficeBuilding, HiOutlineUserCircle } from "react-icons/hi";
import { CiLocationOn } from "react-icons/ci";
import { BriefcaseBusiness, Cog, ChevronDown, ChevronRight, Pill } from "lucide-react";
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
import { useSelector } from "react-redux";
import { LuGrid2X2Plus } from "react-icons/lu";
import { PiSubtitlesLight } from "react-icons/pi";
import { LiaPillsSolid } from "react-icons/lia";

const navItems = [
    { label: "Control Panel", to: "/", icon: <AiOutlineHome className="stroke-2" size={20} /> },
    { label: "User Management", to: "/users", icon: <HiOutlineUsers className="stroke-2" size={20} /> },
    { label: "Company Management", to: "/companies", icon: <HiOutlineOfficeBuilding className="stroke-2" size={20} /> },
    { label: "Job Management", to: "/jobs", icon: <BriefcaseBusiness className="stroke-2" size={20} /> },
    { label: "Governorates and Regions", to: "/regions", icon: <CiLocationOn className="stroke-1" size={20} /> },
    {
        label: "Drugs Management",
        icon: <LiaPillsSolid size={20} />,
        subItems: [
            { label: "Drugs Category", to: "/drug_category", icon: <BiCategory size={20} /> },
            { label: "Drugs", to: "/drugs", icon: <GiPill className="stroke-1" size={20} /> },
        ],
    },
    {
        label: "Settings",
        icon: <Cog className="stroke-2" size={20} />,
        subItems: [
            { label: "Job Category", to: "/job_category", icon: <BiCategory size={20} /> },
            { label: "Job Specialization", to: "/specialization", icon: <HiOutlineUserCircle className="stroke-1" size={20} /> },
            { label: "Company Type", to: "/company_type", icon: <LuGrid2X2Plus className="stroke-1" size={20} /> },
            { label: "Job Title", to: "/job_title", icon: <PiSubtitlesLight className="stroke-1" size={20} /> },
        ],
    },
];

export function AdminSidebar() {
    const location = useLocation();
    const { i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";
    const user = useSelector((state) => state.auth.user);
    const villageName = user?.village?.village?.name || "Marfae";
    const villageImage = user?.village?.village?.image_link || null;

    const [expandedItems, setExpandedItems] = useState({});

    useEffect(() => {
        const initialExpanded = {};
        navItems.forEach((item) => {
            if (item.subItems) {
                const isParentActive = item.subItems.some((sub) =>
                    location.pathname.startsWith(sub.to)
                );
                if (isParentActive) {
                    initialExpanded[item.label] = true;
                }
            }
        });
        setExpandedItems(initialExpanded);
    }, [location.pathname]);

    const toggleExpand = (label) => {
        setExpandedItems((prev) => ({
            ...prev,
            [label]: !prev[label],
        }));
    };

    return (
        <Sidebar
            side={isRTL ? "right" : "left"}
            className="bg-white border-none sm:border-none overflow-x-hidden h-full shadow-lg transition-all duration-300 font-cairo"
        >
            <SidebarContent
                className="bg-white !p-2 text-white border-none overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                style={{
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                }}
            >
                <SidebarGroup>
                    <SidebarGroupLabel className="p-4 text-white flex items-center justify-center gap-3">
                        {villageImage && (
                            <img
                                src={villageImage}
                                alt={villageName || "Village"}
                                className="w-20 h-20 rounded-full object-cover border-2 border-white/30 hover:scale-105 transition-transform duration-200"
                            />
                        )}
                        <span className="text-xl leading-[30px] font-bold text-center text-bg-primary">
                            {"Administration panel"}
                        </span>
                    </SidebarGroupLabel>
                    <hr className="w-full border-white !mb-3" />

                    <SidebarGroupContent>
                        <SidebarMenu className="list-none p-0 rounded-md flex flex-col gap-3">
                            {navItems.map((item) => {
                                const isActive = (() => {
                                    if (item.to === "/") {
                                        return location.pathname === "/";
                                    } else if (item.subItems) {
                                        return item.subItems.some((sub) => location.pathname.startsWith(sub.to));
                                    } else if (item.to) {
                                        return location.pathname.startsWith(item.to);
                                    }
                                    return false;
                                })();

                                const isExpanded = expandedItems[item.label];

                                return (
                                    <SidebarMenuItem key={item.label}>
                                        {item.to && !item.subItems ? (
                                            <Link to={item.to}>
                                                <SidebarMenuButton
                                                    isActive={isActive}
                                                    className={`flex cursor-pointer bg-bgsidebar justify-between items-center gap-3 p-2 text-bg-primary transition-all duration-200 text-base font-medium
                            ${isActive ? "shadow-md bg-bgsidebar" : "bg-white hover:bg-white hover:text-bg-primary"}`}
                                                >
                                                    <div className="flex items-center gap-3 text-bg-primary">
                                                        {item.icon}
                                                        <span className="text-base text-textsidebar">{item.label}</span>
                                                    </div>
                                                </SidebarMenuButton>
                                            </Link>
                                        ) : (
                                            <SidebarMenuButton
                                                onClick={() => toggleExpand(item.label)}
                                                isActive={isActive}
                                                className={`flex cursor-pointer justify-between items-center gap-3 !p-2 text-bg-primary transition-all duration-200 text-base font-medium
                          ${isActive ? "shadow-md bg-bgsidebar" : "bg-white hover:bg-white hover:text-bg-primary"}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {item.icon}
                                                    <span className="text-base text-textsidebar">{item.label}</span>
                                                </div>
                                                {item.subItems && (
                                                    <span>{isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>
                                                )}
                                            </SidebarMenuButton>
                                        )}

                                        {item.subItems && isExpanded && (
                                            <div className="!ml-6 !mt-3 flex flex-col gap-1">
                                                {item.subItems.map((subItem) => {
                                                    const isSubActive = location.pathname.startsWith(subItem.to);
                                                    return (
                                                        <Link to={subItem.to} key={subItem.label}>
                                                            <SidebarMenuButton
                                                                isActive={isSubActive}
                                                                className={`flex cursor-pointer justify-start items-center gap-3 !px-4 !py-2 text-bg-primary transition-all duration-200 text-base
                                  ${isSubActive ? "shadow-md bg-bgsidebar" : "bg-white hover:bg-white hover:text-bg-primary"}`}
                                                            >
                                                                {subItem.icon}
                                                                <span className="text-base text-textsidebar">{subItem.label}</span>
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