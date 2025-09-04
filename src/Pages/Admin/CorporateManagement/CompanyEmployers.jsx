import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useGet } from '@/Hooks/UseGet';
import { useChangeState } from '@/Hooks/useChangeState'; // Import the hook
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Crown, Loader2 } from 'lucide-react';
import FullPageLoader from "@/components/Loading";
import { toast } from "react-toastify";

const CompanyEmployers = () => {
    const { id } = useParams();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch, loading, data } = useGet({
        url: `${apiUrl}/admin/get-employeers-of-company/${id}`
    });
    const { changeState, loadingChange } = useChangeState(); // Initialize the hook
    const [employers, setEmployers] = useState([]);
    const [makingAdminId, setMakingAdminId] = useState(null); // Track which employer is being made admin

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        if (data && data.employeers) {
            const formatted = data.employeers.map((c) => ({
                id: c.id || "—",
                name: `${c.first_name} ${c.last_name}` || c.full_name || "—",
                phone: c.phone || "—",
                email: c.email || "—",
                age: c.age || "—",
                role: c.role || "—",
                is_admin: c.is_admin || false, // Add is_admin field
            }));
            setEmployers(formatted);
        }
    }, [data]);

    const handleMakeAdmin = async (employerId) => {
        setMakingAdminId(employerId);
        
        try {
            const success = await changeState(
                `${apiUrl}/admin/set-admin-for-company/${id}`,
                "Employer made admin successfully!",
                { admin_id: employerId }
            );
            
            if (success) {
               refetch();
            }
        } catch (error) {
            toast.error("Failed to make employer admin");
        } finally {
            setMakingAdminId(null);
        }
    };

    const columns = [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "role", label: "Role" },
        { 
            key: "actions", 
            label: "Actions",
            renderCell: (item) => (
                <div className="flex">
                    {item.is_admin ? (
                        <span className="flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                            <Crown className="h-4 w-4 mr-1" />
                            Admin
                        </span>
                    ) : (
                        <Button
                            onClick={() => handleMakeAdmin(item.id)}
                            disabled={loadingChange && makingAdminId === item.id}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3"
                            size="sm"
                        >
                            {loadingChange && makingAdminId === item.id ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                    Making Admin...
                                </>
                            ) : (
                                "Make Admin"
                            )}
                        </Button>
                    )}
                </div>
            )
        },
    ];

    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row gap-2 mb-4">
                <Link
                    to={-1}
                    className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Companies
                </Link>
                <h2 className="text-2xl text-bg-primary font-bold">
                    Employers for Company #{id}
                </h2>
            </div>

            {loading ? (
                <FullPageLoader />
            ) : (
                <Table
                    data={employers}
                    columns={columns}
                    statusKey="status"
                    className="w-full bg-white rounded-lg shadow-md p-6"
                    actionsButtons={false}
                />
            )}
        </div>
    );
};

export default CompanyEmployers;