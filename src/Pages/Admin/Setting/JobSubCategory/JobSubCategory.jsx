import React, { useState, useEffect } from "react";
import { Table } from '@/components/ui/table';
import { Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGet } from '@/Hooks/UseGet';
import { useDelete } from '@/Hooks/useDelete';
import DeleteDialog from '@/components/DeleteDialog';
import FullPageLoader from "@/components/Loading";

const JobSubCategory = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchJobSubCategory, loading: loadingJobSubCategory, data: dataJobSubCategory } = useGet({ url: `${apiUrl}/admin/get-job-sub-categories` });
    const { deleteData, loadingDelete } = useDelete();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [JobSubCategory, setJobSubCategory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        refetchJobSubCategory();
    }, [refetchJobSubCategory]);

    useEffect(() => {
        if (dataJobSubCategory && dataJobSubCategory.sub_categories) {
            const formatted = dataJobSubCategory.sub_categories.map((j) => ({
                id: j.id || "—",
                name: j.name || "—",
                job_category: j.job_category?.name || "—",
                job_category_id: j.job_category_id || "—",
            }));
            setJobSubCategory(formatted);
        }
    }, [dataJobSubCategory]);

    const Columns = [
        { key: "name", label: "Job Sub Category" },
        { key: "job_category", label: "Category" },
    ];

    const handleEdit = (item) => navigate(`add`, { state: { itemData: item } });

    const handleDelete = (item) => {
        setSelectedRow(item);
        setIsDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedRow) return;

        const success = await deleteData(
            `${apiUrl}/admin/delete-job-sub-category/${selectedRow.id}`,
            `${selectedRow.name} Deleted Successfully.`
        );

        if (success) {
            setIsDeleteOpen(false);
            setJobSubCategory((prev) => prev.filter((item) => item.id !== selectedRow.id));
            setSelectedRow(null);
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl text-bg-primary font-bold">Job Sub Category</h2>
                <Link
                    to="add"
                    className="flex justify-center items-center px-4 py-1 rounded-md text-base bg-bg-secondary font-semibold text-white hover:bg-bg-secondary/90"
                >
                    <Plus className="mr-2 h-4 w-4 text-white" /> Add Job Sub Category
                </Link>
            </div>
            {loadingJobSubCategory || loadingDelete ? (
                <FullPageLoader />
            ) : (
                <Table
                    data={JobSubCategory}
                    columns={Columns}
                    statusKey="status"
                    // filterKeys={["title", "company", "job_category"]}
                    // titles={{ title: "Job Title" }}
                    onEdit={(item) => handleEdit({ ...item })}
                    onDelete={handleDelete}
                    className="w-full bg-white rounded-lg shadow-md p-6"
                />
            )}
            <DeleteDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onDelete={handleDeleteConfirm}
                name={selectedRow?.name}
                isLoading={loadingDelete}
            />
        </div>
    );
};

export default JobSubCategory;