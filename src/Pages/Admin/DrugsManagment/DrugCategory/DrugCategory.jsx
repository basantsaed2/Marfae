import React, { useState, useEffect } from "react";
import { Table } from '@/components/ui/table';
import { Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGet } from '@/Hooks/UseGet';
import { useDelete } from '@/Hooks/useDelete';
import DeleteDialog from '@/components/DeleteDialog'; // Import DeleteDialog
import FullPageLoader from "@/components/Loading";

const DrugCategory = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchDrugCategory, loading: loadingDrugCategory, data: dataDrugCategory } = useGet({ url: `${apiUrl}/admin/getDrugCategories` });
    const { deleteData, loadingDelete } = useDelete();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [countries, setCountries] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        refetchDrugCategory();
    }, [refetchDrugCategory]);

    useEffect(() => {
        if (dataDrugCategory && dataDrugCategory.drug_categories) {
            const formatted = dataDrugCategory?.drug_categories?.map((u) => ({
                id: u.id,
                drugCategory: u.name || "—",
                description: u.description || "—",
                status: u.status === "active" ? "Active" : "Inactive",
            }));
            setCountries(formatted);
        }
    }, [dataDrugCategory]);

    const Columns = [
        { key: "drugCategory", label: "Drug Category" },
        { key: "description", label: "Category Description" },
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
            `${apiUrl}/admin/deleteDrugCategory/${selectedRow.id}`,
            `${selectedRow.drugCategory} Deleted Successfully.`
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
                <h2 className="text-2xl text-bg-primary font-bold">Drug Category</h2>
                <Link
                    to="add"
                    className="flex justify-center items-center px-4 py-1 rounded-md text-base bg-bg-secondary font-semibold text-white hover:bg-bg-secondary/90"
                >
                    <Plus className="mr-2 h-4 w-4 text-white" /> Add Drug Category
                </Link>
            </div>
            {loadingDrugCategory ? (
                <FullPageLoader />
            ) : (
                <Table
                    data={countries}
                    columns={Columns}
                    statusKey="status"
                    filterKeys={["status"]}
                    // titles={{ drugCategory: "Drug Category" }}
                    onEdit={(item) => handleEdit({ ...item, type: 'drugCategory' })}
                    onDelete={handleDelete}
                    className="w-full bg-white rounded-lg shadow-md p-6"
                />
            )}
            <DeleteDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onDelete={handleDeleteConfirm}
                name={selectedRow?.drugCategory}
                isLoading={loadingDelete}
            />
        </div>
    );
};

export default DrugCategory;