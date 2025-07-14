import React, { useState, useEffect } from "react";
import { Table } from '@/components/ui/table';
import { Plus, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGet } from '@/Hooks/UseGet';
import FullPageLoader from "@/components/Loading";

const ContactRequest = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchCV, loading: loadingCV, data: dataCV } = useGet({ url: `${apiUrl}/admin/getContactsRequests` });
    const [solvedCV, setSolvedCV] = useState([]);
    const [unsolvedCV, setUnsolvedCV] = useState([]);
    const [activeTab, setActiveTab] = useState("unsolved"); // Default to unsolved tab
    const navigate = useNavigate();

    useEffect(() => {
        refetchCV();
    }, [refetchCV]);

    useEffect(() => {
        if (dataCV && dataCV.solved && dataCV.unsolved) {
            const formattedSolved = dataCV.solved.map((j) => ({
                id: j.id || "—",
                full_name: j.full_name || "—",
                email: j.email || "—",
                subject: j.subject || "—",
                message: j.message || "—",
                status: j.status || "—",
                created_at: new Date(j.created_at).toLocaleDateString() || "—",
            }));
            const formattedUnsolved = dataCV.unsolved.map((j) => ({
                id: j.id || "—",
                full_name: j.full_name || "—",
                email: j.email || "—",
                subject: j.subject || "—",
                message: j.message || "—",
                status: j.status || "—",
                created_at: new Date(j.created_at).toLocaleDateString() || "—",
            }));
            setSolvedCV(formattedSolved);
            setUnsolvedCV(formattedUnsolved);
        }
    }, [dataCV]);

    const Columns = [
        { key: "full_name", label: "Full Name" },
        { key: "email", label: "Email" },
        { key: "subject", label: "Subject" },
        { key: "message", label: "Message" },
        { key: "status", label: "Status" },
        { key: "created_at", label: "Created At" },
    ];

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl text-bg-primary font-bold">Contact Requests Management</h2>
            </div>

            {/* Tabs */}
            <div className="mb-4">
                <button
                    onClick={() => handleTabChange("unsolved")}
                    className={`px-4 py-2 mr-2 rounded-md ${activeTab === "unsolved" ? "bg-bg-secondary text-white" : "bg-gray-200 text-black"}`}
                >
                    Unsolved ({unsolvedCV.length})
                </button>
                <button
                    onClick={() => handleTabChange("solved")}
                    className={`px-4 py-2 rounded-md ${activeTab === "solved" ? "bg-bg-secondary text-white" : "bg-gray-200 text-black"}`}
                >
                    Solved ({solvedCV.length})
                </button>
            </div>

            {loadingCV ? (
                <FullPageLoader />
            ) : (
                <Table
                    data={activeTab === "unsolved" ? unsolvedCV : solvedCV}
                    columns={Columns}
                    statusKey="status"
                    actionsButtons={false}
                    className="w-full bg-white rounded-lg shadow-md p-6"
                />
            )}
        </div>
    );
};

export default ContactRequest;