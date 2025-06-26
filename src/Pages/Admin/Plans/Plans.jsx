import React, { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGet } from '@/Hooks/UseGet';
import { useDelete } from '@/Hooks/useDelete';
import DeleteDialog from '@/components/DeleteDialog';
import FullPageLoader from "@/components/Loading";

const Plans = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchPlans, loading: loadingPlans, data: dataPlans } = useGet({ url: `${apiUrl}/admin/getPlans` });
    const { deleteData, loadingDelete } = useDelete();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [plans, setPlans] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        refetchPlans();
    }, [refetchPlans]);

    useEffect(() => {
        if (dataPlans && dataPlans.plans) {
            const formatted = dataPlans.plans.map((plan) => ({
                id: plan.id,
                name: plan.name,
                description: plan.description,
                price: plan.price,
                price_after_discount: plan.price_after_discount,
                status: plan.status,
                type: plan.type,
                features: plan.features,
                created_at: plan.created_at,
                updated_at: plan.updated_at,
                top_picked: plan.top_picked,
                job_categories: Array.isArray(plan.job_categories)
                    ? plan.job_categories.map((s) => ({
                        id: s?.id,
                        name: s?.name || "—",
                    }))
                    : [],
            }));
            setPlans(formatted);
        }
    }, [dataPlans]);

    const handleEdit = (item) => navigate(`add`, { state: { itemData: item } });

    const handleDelete = (item) => {
        setSelectedRow(item);
        setIsDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedRow) return;

        const success = await deleteData(
            `${apiUrl}/admin/deletePlan/${selectedRow.id}`,
            `${selectedRow.name} Deleted Successfully.`
        );

        if (success) {
            setIsDeleteOpen(false);
            setPlans((prev) => prev.filter((item) => item.id !== selectedRow.id));
            setSelectedRow(null);
        }
    };

    const PlanCard = ({ plan }) => (
        <div className="flex flex-col justify-between bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
            <div className="flex flex-col">
                <div className="flex justify-end space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${plan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                    </span>
                    {plan.top_picked === 1 && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 flex items-center">
                            <Star className="w-4 h-4 mr-1" /> Top Picked
                        </span>
                    )}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mt-3 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{plan.description}</p>
                <div className="mb-4">
                    <p className="text-3xl font-semibold text-blue-600">{plan.price_after_discount} EGP
                        <span className="text-sm text-gray-500 line-through ml-2">{plan.price} EGP</span>
                    </p>
                    <p className="text-sm text-gray-500 capitalize">{plan.type}</p>
                </div>
                <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-2">Features:</h4>
                    <ul className="space-y-2">
                        <li className="flex items-center text-gray-600">
                            <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            {plan.features.cv_number} CVs
                        </li>
                        {Object.entries(plan.features)
                            .filter(([key]) => key !== 'cv_number')
                            .map(([key, feature], index) => (
                                <li key={index} className="flex items-center text-gray-600">
                                    <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                    </ul>
                </div>
                {plan.job_categories.length > 0 && (
                    <div className="mb-6">
                        <h4 className="font-semibold text-gray-700 mb-2">Plan Categories:</h4>
                        <ul className="space-y-2">
                            {plan.job_categories.map((category, index) => (
                                <li key={index} className="flex items-center text-gray-600">
                                    <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    {category.name || "—"}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <div className="flex justify-end space-x-3">
                <Button
                    onClick={() => handleEdit(plan)}
                    className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Pencil className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button
                    onClick={() => handleDelete(plan)}
                    className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
            </div>
        </div>
    );

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl text-bg-primary font-bold">Plans Management</h2>
                <Link
                    to="add"
                    className="flex items-center px-4 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
                >
                    <Plus className="h-4 w-4 mr-2" /> Add Plan
                </Link>
            </div>

            {loadingPlans || loadingDelete ? (
                <FullPageLoader />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <PlanCard key={plan.id} plan={plan} />
                    ))}
                </div>
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

export default Plans;