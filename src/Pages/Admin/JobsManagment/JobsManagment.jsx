import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGet } from '@/Hooks/UseGet';
import { useDelete } from '@/Hooks/useDelete';
import DeleteDialog from '@/components/DeleteDialog';
import FullPageLoader from "@/components/Loading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const JobManagement = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchJobs, loading: loadingJobs, data: dataJobs } = useGet({ url: `${apiUrl}/admin/getJobs` });
    const { deleteData, loadingDelete } = useDelete();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        refetchJobs();
    }, [refetchJobs]);

    useEffect(() => {
        if (dataJobs && dataJobs.jobs) {
            const formatted = dataJobs.jobs.map((j) => ({
                id: j.id || "—",
                title: j.job_titel?.name || "—",
                job_titel_id: j.job_titel_id?.toString() || "—", // Add job_titel_id for edit
                company: j.company?.name || "—",
                job_category: j.job_category?.name || "—",
                city: j.city?.name || "—",
                zone: j.zone?.name || "—",
                type: j.type || "—",
                level: j.experience || "—",
                status: j.status === "active" ? "Active" : "Inactive",
                description: j.description || "—",
                qualifications: j.qualifications || "—",
                expected_salary: j.expected_salary || "—",
                expire_date: j.expire_date || "—",
                location_link: j.location_link || "—",
                image_link: j.image_link || "—",
                company_id: j.company_id || "—",
                job_category_id: j.job_category_id || "—",
                city_id: j.city_id || "—",
                zone_id: j.zone_id || "—",
            }));
            setJobs(formatted);
        }
    }, [dataJobs]);

    const Columns = [
        { key: "title", label: "Job Title" },
        { key: "company", label: "Company" },
        { key: "job_category", label: "Category" },
        { key: "city", label: "City" },
        { key: "zone", label: "Zone" },
        { key: "type", label: "Type" },
        { key: "level", label: "Experience" },
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
            `${apiUrl}/admin/deleteJob/${selectedRow.id}`,
            `${selectedRow.title} Deleted Successfully.`
        );

        if (success) {
            setIsDeleteOpen(false);
            setJobs((prev) => prev.filter((item) => item.id !== selectedRow.id));
            setSelectedRow(null);
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl text-bg-primary font-bold">Job Management</h2>
                <Link
                    to="add"
                    className="flex justify-center items-center px-4 py-1 rounded-md text-base bg-bg-secondary font-semibold text-white hover:bg-bg-secondary/90"
                >
                    <Plus className="mr-2 h-4 w-4 text-white" /> Add Job
                </Link>
            </div>
            {loadingJobs || loadingDelete ? (
                <FullPageLoader />
            ) : (
                <Table
                    data={jobs}
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
                name={selectedRow?.title}
                isLoading={loadingDelete}
            />
        </div>
    );
};

export default JobManagement;