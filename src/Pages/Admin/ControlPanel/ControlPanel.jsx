"use client";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { Link } from "react-router-dom";
import { BriefcaseBusiness, Clipboard } from "lucide-react";
import { HiOutlineUsers, HiOutlineOfficeBuilding } from "react-icons/hi";

const ControlPanel = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const isLoading = useSelector((state) => state.loader.isLoading);
    const [homeStats, setHomeStats] = useState({
        totalActiveJobs: 0,
        totalCompanies: 0,
        totalPendingEmployeerRequests: 0,
        totalUsers: 0
    });

    const { refetch: refetchHomeList, loading: loadingHomeList, data: HomeListData } = useGet({
        url: `${apiUrl}/admin/homePage`,
    });
    const { t } = useTranslation();

    useEffect(() => {
        refetchHomeList();
    }, [refetchHomeList]);

    useEffect(() => {
        if (HomeListData) {
            setHomeStats(HomeListData);
        }
    }, [HomeListData]);

    if (isLoading || loadingHomeList) {
        return <FullPageLoader />;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-bg-primary mb-6">
                {t("Control Panel")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-x-12 xl:gap-x-18 gap-y-8 mb-8">

                {/* Units Number */}

                <Link to={"job_management/jobs"} className="bg-white items-center gap-4 text-bg-primary py-4 px-6 rounded-2xl shadow flex">
                    <div className="!p-4 flex items-center justify-center bg-bg-secondary rounded-md">
                        <BriefcaseBusiness className="text-2xl text-white" />
                    </div>
                    <div className="!p-2">
                        <div className="">{t("Total Jobs")}</div>
                        <div className="text-3xl font-bold">{homeStats.totalActiveJobs}</div>
                    </div>
                </Link>

                <Link to={"requests"} className="bg-white items-center gap-4 text-bg-primary py-4 px-6 rounded-2xl shadow flex">
                    <div className="!p-4 flex items-center justify-center bg-bg-secondary rounded-md">
                        <Clipboard className="text-2xl text-white" />
                    </div>
                    <div className="!p-2">
                        <div className="">{t("Total Requests")}</div>
                        <div className="text-3xl font-bold">{homeStats.totalPendingEmployeerRequests}</div>
                    </div>
                </Link>

                <Link to={"users"} className="bg-white items-center gap-4 text-bg-primary py-4 px-6 rounded-2xl shadow flex">
                    <div className="!p-4 flex items-center justify-center bg-bg-secondary rounded-md">
                        <HiOutlineUsers className="text-2xl text-white" />
                    </div>
                    <div className="!p-2">
                        <div className="">{t("Total Users")}</div>
                        <div className="text-3xl font-bold">{homeStats.totalUsers}</div>
                    </div>
                </Link>

                <Link to={"company_management/companies"} className="bg-white items-center gap-4 text-bg-primary py-4 px-6 rounded-2xl shadow flex">
                    <div className="!p-4 flex items-center justify-center bg-bg-secondary rounded-md">
                        <HiOutlineOfficeBuilding className="text-2xl text-white" />
                    </div>
                    <div className="!p-2">
                        <div className="">{t("Total Companies")}</div>
                        <div className="text-3xl font-bold">{homeStats.totalCompanies}</div>
                    </div>
                </Link>

            </div>
        </div>
    );
};

export default ControlPanel;