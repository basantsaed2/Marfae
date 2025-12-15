import React, { useState, useEffect } from "react";
import { Table } from '@/components/ui/table';
import { Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGet } from '@/Hooks/UseGet';
import { useChangeState } from '@/Hooks/useChangeState';
import DeleteDialog from '@/components/DeleteDialog';
import FullPageLoader from "@/components/Loading";
import { useDelete } from "@/Hooks/useDelete";

const Articles = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchArticles, loading: loadingArticles, data: dataArticles } = useGet({ url: `${apiUrl}/admin/get-articles` });
    const { deleteData, loadingDelete } = useDelete();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [articles, setArticles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        refetchArticles();
    }, [refetchArticles]);

    useEffect(() => {
        if (dataArticles && dataArticles.articles) {
            const formatted = dataArticles.articles.map((c) => ({
                id: c.id || "—",
                title: c.title || "—",
                body: c.body || "—",
                image: c.image || "—",

            }));
            setArticles(formatted);
        }
    }, [dataArticles]);
    const Columns = [
        { key: "img", label: "Image" },
        { key: "title", label: "Title" },
        { key: "body", label: "Body" },
    ];

    const handleEdit = (item) => navigate(`add`, { state: { companyDetails: item } });

    const handleDelete = (item) => {
        setSelectedRow(item);
        setIsDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedRow) return;

        const success = await deleteData(
            `${apiUrl}/admin/delete-article/${selectedRow.id}`,
            `${selectedRow.title} Deleted Successfully.`
        );
        if (success) {
            setIsDeleteOpen(false);
            setArticles((prev) => prev.filter((item) => item.id !== selectedRow.id));
            setSelectedRow(null);
        }

    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl text-bg-primary font-bold">Articles Management</h2>
                <Link
                    to="add"
                    className="flex justify-center items-center px-4 py-1 rounded-md text-base bg-bg-secondary font-semibold text-white hover:bg-bg-secondary/90"
                >
                    <Plus className="mr-2 h-4 w-4 text-white" /> Add Article
                </Link>
            </div>
            {loadingArticles ? (
                <FullPageLoader />
            ) : (
                <Table
                    data={articles}
                    columns={Columns}
                    statusKey="status"
                    onEdit={(item) => handleEdit({ ...item })}
                    onDelete={handleDelete}
                    className="w-full bg-white rounded-lg shadow-md p-6"
                />
            )}
            <DeleteDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onDelete={handleDeleteConfirm}
                name={selectedRow?.title}
                isLoading={loadingDelete}
            />
        </div>
    );
};

export default Articles;