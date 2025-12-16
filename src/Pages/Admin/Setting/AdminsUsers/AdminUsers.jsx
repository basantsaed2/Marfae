import React, { useState, useEffect } from "react";
import { Table } from '@/components/ui/table';
import { Link, useNavigate } from 'react-router-dom';
import { useGet } from '@/Hooks/UseGet';
import DeleteDialog from '@/components/DeleteDialog';
import FullPageLoader from "@/components/Loading";
import { Plus } from 'lucide-react';
import { useDelete } from "@/Hooks/useDelete";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

const AdminUsers = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    // Endpoints
    const getAdminsUrl = `${apiUrl}/admin/get-admins`;
    const deleteAdminUrl = (id) => `${apiUrl}/admin/delete-account/${id}`;
    const toggleStatusUrl = (id) => `${apiUrl}/admin/deactivate-account/${id}`; // Reused for toggle

    const { refetch: refetchAdmins, loading: loadingAdmins, data: dataAdmins } = useGet({ url: getAdminsUrl });
    const { deleteData, loadingDelete } = useDelete();

    const [admins, setAdmins] = useState([]);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [loadingToggle, setLoadingToggle] = useState(false);

    // View Details State
    const [selectedViewRow, setSelectedViewRow] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    useEffect(() => {
        refetchAdmins();
    }, [refetchAdmins]);

    useEffect(() => {
        if (dataAdmins && dataAdmins.admins) {
            const formatted = dataAdmins.admins.map((admin) => ({
                id: admin.id,
                name: (admin.first_name || "") + " " + (admin.last_name || ""),
                first_name: admin.first_name,
                last_name: admin.last_name,
                email: admin.email || "—",
                phone: admin.phone || "—",
                roles: admin.roles || [],
                rolesDisplay: Array.isArray(admin.roles)
                    ? admin.roles.map(r => r.name || r).join(", ")
                    : (admin.role_names?.join(", ") || "—"),
                status: admin.status || "active",
                raw: admin
            }));
            setAdmins(formatted);
        } else if (Array.isArray(dataAdmins)) {
            const formatted = dataAdmins.map((admin) => ({
                id: admin.id,
                name: (admin.first_name || "") + " " + (admin.last_name || ""),
                first_name: admin.first_name,
                last_name: admin.last_name,
                email: admin.email || "—",
                phone: admin.phone || "—",
                roles: admin.roles || [],
                rolesDisplay: Array.isArray(admin.roles)
                    ? admin.roles.map(r => r.name || r).join(", ")
                    : (admin.role_names?.join(", ") || "—"),
                status: admin.status || "active",
                raw: admin
            }));
            setAdmins(formatted);
        }
    }, [dataAdmins]);

    const handleEdit = (item) => navigate('add', { state: { itemData: item } });

    const handleDelete = (item) => {
        if (String(item.id) === String(user?.user?.id)) {
            toast.error("You cannot delete your own account.");
            return;
        }
        setSelectedRow(item);
        setIsDeleteOpen(true);
    };

    const handleView = (item) => {
        setSelectedViewRow(item.raw || item);
        setIsViewOpen(true);
    };

    // Unified toggle function (activate / deactivate)
    const handleToggleStatus = async (id, name, currentStatus) => {
        setLoadingToggle(true);
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${user?.token || ''}`,
                },
            };
            await axios.post(toggleStatusUrl(id), { status: currentStatus === "active" ? "inactive" : "active" }, config);

            const newStatus = currentStatus === "active" ? "inactive" : "active";
            const action = newStatus === "inactive" ? "deactivated" : "activated";

            toast.success(`Account ${name} ${action} successfully.`);
            refetchAdmins();
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed to update account status.");
        } finally {
            setLoadingToggle(false);
        }
    };

    const Columns = [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "rolesDisplay", label: "Roles" },
        { key: "status", label: "Status" },
        {
            key: "toggleStatus",
            label: "Actions",
            renderCell: (row) => {
                const isActive = row.status === "active";
                const buttonText = isActive ? "Deactivate" : "Activate";
                const buttonColor = isActive
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-green-500 hover:bg-green-600";

                return (
                    <button
                        onClick={() => handleToggleStatus(row.id, row.name, row.status)}
                        className={`flex justify-center items-center px-3 py-1 rounded text-white transition-colors text-xs font-semibold ${buttonColor}`}
                        disabled={loadingToggle}
                        title={buttonText + " Account"}
                    >
                        {buttonText}
                    </button>
                );
            }
        }
    ];

    const handleDeleteConfirm = async () => {
        if (!selectedRow) return;

        const success = await deleteData(
            deleteAdminUrl(selectedRow.id),
            `${selectedRow.name} Deleted Successfully.`,
            {}
        );

        if (success) {
            setIsDeleteOpen(false);
            setAdmins((prev) => prev.filter((item) => item.id !== selectedRow.id));
            setSelectedRow(null);
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl md:text-2xl text-bg-primary font-bold">Admins Management</h2>
                <Link
                    to="add"
                    className="flex justify-center items-center px-4 py-1 rounded-md text-base bg-bg-secondary font-semibold text-white hover:bg-bg-secondary/90"
                >
                    <Plus className="mr-2 h-4 w-4 text-white" /> Add Admin
                </Link>
            </div>

            {loadingAdmins ? (
                <FullPageLoader />
            ) : (
                <Table
                    data={admins}
                    columns={Columns}
                    actionsButtons={true}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    className="w-full bg-white rounded-lg shadow-md p-4 md:p-6"
                />
            )}

            <DeleteDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onDelete={handleDeleteConfirm}
                name={selectedRow?.name}
                isLoading={loadingDelete}
            />

            {/* View Details Dialog */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="max-h-[80vh] overflow-y-auto bg-white">
                    <DialogHeader>
                        <DialogTitle>Admin Details</DialogTitle>
                        <DialogDescription>
                            Full information for {selectedViewRow?.full_name || selectedViewRow?.name}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedViewRow && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="font-semibold text-sm text-gray-500">First Name</p>
                                    <p>{selectedViewRow.first_name || "—"}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-gray-500">Last Name</p>
                                    <p>{selectedViewRow.last_name || "—"}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-gray-500">Email</p>
                                    <p>{selectedViewRow.email || "—"}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-gray-500">Phone</p>
                                    <p>{selectedViewRow.phone || "—"}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-gray-500">Status</p>
                                    <span className={`px-2 py-1 rounded-full text-xs ${selectedViewRow.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {selectedViewRow.status || "—"}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <p className="font-semibold text-sm text-gray-500 mb-2">Roles</p>
                                <div className="flex flex-wrap gap-2">
                                    {(selectedViewRow.role_names || selectedViewRow.roles || []).map((role, idx) => (
                                        <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                            {typeof role === 'string' ? role : role.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="font-semibold text-sm text-gray-500 mb-2">Permissions</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedViewRow.permissions && selectedViewRow.permissions.length > 0 ? (
                                        selectedViewRow.permissions.map((perm, idx) => (
                                            <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded border">
                                                {perm}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm">No specific permissions</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminUsers;