import React, { useState, useEffect } from "react";
import { Table } from '@/components/ui/table';
import { Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGet } from '@/Hooks/UseGet';
import DeleteDialog from '@/components/DeleteDialog';
import FullPageLoader from "@/components/Loading";
import { useDelete } from "@/Hooks/useDelete";

// Fixed imports for ShadCN Dialog
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

const Articles = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    const { refetch: refetchArticles, loading: loadingArticles, data: dataArticles } = useGet({
        url: `${apiUrl}/admin/get-articles`
    });
    const { deleteData, loadingDelete } = useDelete();

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [articles, setArticles] = useState([]);

    // Modal state
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null); // Now store full article

    useEffect(() => {
        refetchArticles();
    }, [refetchArticles]);

    useEffect(() => {
        if (dataArticles && dataArticles.articles) {
            const formatted = dataArticles.articles.map((c) => ({
                id: c.id || "—",
                title: c.title || "No Title",
                description: c.body || "No description available.",
                img: c.image_link && !c.image_link.includes("Invalid") ? c.image_link : null,
                image: c.image || "—",
            }));
            setArticles(formatted);
        }
    }, [dataArticles]);

    const Columns = [
        { key: "img", label: "Image" },
        { key: "title", label: "Title" },
        {
            key: "description",
            label: "Description",
            renderCell: (item) => (
                <div className="max-w-md">
                    {/* Truncated preview */}
                    <p className="line-clamp-3 text-gray-700 mb-2">
                        {item.description}
                    </p>
                    {/* View button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedArticle(item);
                            setViewModalOpen(true);
                        }}
                        className="text-bg-primary font-semibold text-sm hover:underline inline-flex items-center"
                    >
                        View Full →
                    </button>
                </div>
            ),
        },
    ];

    const handleEdit = (item) => {
        navigate(`add`, { state: { companyDetails: item } });
    };

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
            setArticles((prev) => prev.filter((a) => a.id !== selectedRow.id));
            setSelectedRow(null);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="w-full">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-bg-primary">Articles Management</h2>
                    <Link
                        to="add"
                        className="flex items-center gap-2 px-5 py-3 rounded-lg bg-bg-secondary text-white font-semibold hover:bg-bg-secondary/90 transition"
                    >
                        <Plus className="h-5 w-5" />
                        Add Article
                    </Link>
                </div>

                {loadingArticles ? (
                    <FullPageLoader />
                ) : (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <Table
                            data={articles}
                            columns={Columns}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            actionsButtons={true}
                            className="w-full"
                        />
                    </div>
                )}

                {/* Delete Confirmation */}
                <DeleteDialog
                    open={isDeleteOpen}
                    onOpenChange={setIsDeleteOpen}
                    onDelete={handleDeleteConfirm}
                    name={selectedRow?.title}
                    isLoading={loadingDelete}
                />

                {/* Full Article Preview Modal */}
                <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh] bg-white overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-gray-900">
                                {selectedArticle?.title}
                            </DialogTitle>
                        </DialogHeader>

                        {selectedArticle && (
                            <div className="mt-6 space-y-6">
                                {/* Image */}
                                {selectedArticle.img ? (
                                    <img
                                        src={selectedArticle.img}
                                        alt={selectedArticle.title}
                                        className="w-full max-h-96 object-cover rounded-xl shadow-md"
                                    />
                                ) : (
                                    <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 border-2 border-dashed">
                                        No image available
                                    </div>
                                )}

                                {/* Full Description */}
                                <div className="prose prose-lg max-w-none">
                                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                        {selectedArticle.description}
                                    </p>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default Articles;