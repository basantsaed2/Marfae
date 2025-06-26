import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGet } from '@/Hooks/UseGet';
import { useDelete } from '@/Hooks/useDelete';
import DeleteDialog from '@/components/DeleteDialog'; // Import DeleteDialog
import FullPageLoader from "@/components/Loading";

const CompanyType = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchCompanyType, loading: loadingCompanyType, data: dataCompanyType } = useGet({ url: `${apiUrl}/admin/getCompanyTypes` });
    const { deleteData, loadingDelete } = useDelete();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [countries, setCountries] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        refetchCompanyType();
    }, [refetchCompanyType]);

    useEffect(() => {
        if (dataCompanyType && dataCompanyType.company_types) {
            const formatted = dataCompanyType?.company_types?.map((u) => ({
                id: u.id,
                CompanyType: u.name || "—",
                status: u.status === "active" ? "Active" : "Inactive",
            }));
            setCountries(formatted);
        }
    }, [dataCompanyType]);

    const Columns = [
        { key: "CompanyType", label: "CompanyType" },
        { key: "status", label: "Status" },
    ];

    const handleEdit = (item) => navigate(`add`, { state: { itemData: item } });

    const handleDelete = (item) => {
        setSelectedRow(item);
        setIsDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedRow) return;

        const success = await deleteData(
            `${apiUrl}/admin/deleteCompanyType/${selectedRow.id}`,
            `${selectedRow.CompanyType} Deleted Successfully.`
        );
        if (success) {
            setIsDeleteOpen(false);
            setCountries((prev) => prev.filter((item) => item.id !== selectedRow.id));
            setSelectedRow(null);
        }

    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl text-bg-primary font-bold">CompanyType</h2>
                <Link
                    to="add"
                    className="flex justify-center items-center px-4 py-1 rounded-md text-base bg-bg-secondary font-semibold text-white hover:bg-bg-secondary/90"
                >
                    <Plus className="mr-2 h-4 w-4 text-white" /> Add Company Type
                </Link>
            </div>
            {loadingCompanyType ? (
                <FullPageLoader />
            ) : (
                <Table
                    data={countries}
                    columns={Columns}
                    statusKey="status"
                    filterKeys={["status"]}
                    // titles={{ CompanyType: "CompanyType"}}
                    onEdit={(item) => handleEdit({ ...item, type: 'CompanyType' })}
                    onDelete={handleDelete}
                    className="w-full bg-white rounded-lg shadow-md p-6"
                />
            )}
            <DeleteDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onDelete={handleDeleteConfirm}
                name={selectedRow?.CompanyType}
                isLoading={loadingDelete}
            />
        </div>
    );
};

export default CompanyType;