import React, { useState, useEffect } from "react";
import { Table} from '@/components/ui/table';
import { Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGet } from '@/Hooks/UseGet';
import { useDelete } from '@/Hooks/useDelete';
import DeleteDialog from '@/components/DeleteDialog'; // Import DeleteDialog
import FullPageLoader from "@/components/Loading";

const Qualifications = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchQualifications, loading: loadingQualifications, data: dataQualifications } = useGet({ url: `${apiUrl}/admin/get-jobs-qualifications` });
    const { deleteData, loadingDelete } = useDelete();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [Qualificationss, setQualifications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        refetchQualifications();
    }, [refetchQualifications]);

    useEffect(() => {
        if (dataQualifications && dataQualifications.job_qualifications) {
            const formatted = dataQualifications?.job_qualifications?.map((u) => ({
                id: u.id,
                qualification: u.name || "—",
                status: u.status === "active" ? "Active" : "Inactive",
            }));
            setQualifications(formatted);
        }
    }, [dataQualifications]);

    const Columns = [
        { key: "qualification", label: "Qualification" },
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
            `${apiUrl}/admin/delete-job-qualification/${selectedRow.id}`,
            `${selectedRow.qualification} Deleted Successfully.`
        );
        if (success) {
            setIsDeleteOpen(false);
            setQualifications((prev) => prev.filter((item) => item.id !== selectedRow.id));
            setSelectedRow(null);
        }

    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl text-bg-primary font-bold">Qualifications</h2>
                <Link
                    to="add"
                    className="flex justify-center items-center px-4 py-1 rounded-md text-base bg-bg-secondary font-semibold text-white hover:bg-bg-secondary/90"
                >
                    <Plus className="mr-2 h-4 w-4 text-white" /> Add Qualification
                </Link>
            </div>
            {loadingQualifications ? (
                <FullPageLoader />
            ) : (
                <Table
                    data={Qualificationss}
                    columns={Columns}
                    statusKey="status"
                    filterKeys={["status"]}
                    // titles={{ Qualifications: "Qualifications" }}
                    onEdit={(item) => handleEdit({ ...item, type: 'qualification' })}
                    onDelete={handleDelete}
                    className="w-full bg-white rounded-lg shadow-md p-6"
                />
            )}
            <DeleteDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onDelete={handleDeleteConfirm}
                name={selectedRow?.Qualifications}
                isLoading={loadingDelete}
            />
        </div>
    );
};

export default Qualifications;