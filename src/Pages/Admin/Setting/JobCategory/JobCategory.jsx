import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGet } from '@/Hooks/UseGet';
import { useDelete } from '@/Hooks/useDelete';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeleteDialog from '@/components/DeleteDialog'; // Import DeleteDialog
import FullPageLoader from "@/components/Loading";

const JobCategory = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchCategory, loading: loadingCategory, data: dataCategory } = useGet({ url: `${apiUrl}/admin/getJobCategories` });
    const { deleteData, loadingDelete } = useDelete();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [countries, setCountries] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        refetchCategory();
    }, [refetchCategory]);

    useEffect(() => {
        if (dataCategory && dataCategory.jobCategories) {
            const formatted = dataCategory?.jobCategories?.map((u) => ({
                id: u.id,
                category: u.name || "—",
                status: u.status === "active" ? "Active" : "Inactive",
            }));
            setCountries(formatted);
        }
    }, [dataCategory]);

    const Columns = [
        { key: "category", label: "Job Category" },
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
            `${apiUrl}/admin/deleteJobCategory/${selectedRow.id}`,
            `${selectedRow.category} Deleted Successfully.`
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
                <h2 className="text-2xl text-bg-primary font-bold">Job Category</h2>
                <Link
                    to="add"
                    className="flex justify-center items-center px-4 py-1 rounded-md text-base bg-bg-secondary font-semibold text-white hover:bg-bg-secondary/90"
                >
                    <Plus className="mr-2 h-4 w-4 text-white" /> Add Job Category
                </Link>
            </div>
            {loadingCategory ? (
                <FullPageLoader />
            ) : (
                <Table
                    data={countries}
                    columns={Columns}
                    statusKey="status"
                    filterKeys={["status"]}
                    // titles={{ category: "Category" }}
                    onEdit={(item) => handleEdit({ ...item, type: 'category' })}
                    onDelete={handleDelete}
                    className="w-full bg-white rounded-lg shadow-md p-6"
                />
            )}
            <DeleteDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onDelete={handleDeleteConfirm}
                name={selectedRow?.category}
                isLoading={loadingDelete}
            />
        </div>
    );
};

export default JobCategory;