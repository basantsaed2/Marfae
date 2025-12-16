import React, { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useGet } from '@/Hooks/UseGet';
import DeleteDialog from '@/components/DeleteDialog';
import FullPageLoader from "@/components/Loading";
import { Plus, Shield, Lock, Eye, Edit, Trash2, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useDelete } from "@/Hooks/useDelete";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Roles = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    // API endpoints
    const rolesUrl = `${apiUrl}/admin/roles`;
    const deleteRoleUrl = (id) => `${apiUrl}/admin/roles/${id}`;

    // Hooks
    const { refetch: refetchRoles, loading: loadingRoles, data: dataRoles } = useGet({ url: rolesUrl });
    const { deleteData, loadingDelete } = useDelete();

    // State
    const [roles, setRoles] = useState([]);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    // Fetch roles
    useEffect(() => {
        refetchRoles();
    }, [refetchRoles]);

    // Format roles data
    useEffect(() => {
        const rolesArray = dataRoles?.roles || dataRoles;
        if (rolesArray && Array.isArray(rolesArray)) {
            const formatted = rolesArray.map((role) => ({
                id: role.id,
                name: role.name || "Unnamed Role",
                permissions: role.permissions || [],
                permissions_count: role.permissions ? role.permissions.length : 0,
            }));
            setRoles(formatted);
        }
    }, [dataRoles]);

    const handleEdit = (item) => navigate('add', { state: { itemData: item } });

    const handleDelete = (item) => {
        setSelectedRow(item);
        setIsDeleteOpen(true);
    };

    const handleOpenDetails = (item) => {
        setSelectedRow(item);
        setIsDetailsOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedRow) return;

        const success = await deleteData(
            deleteRoleUrl(selectedRow.id),
            `${selectedRow.name} Deleted Successfully.`,
            {}
        );

        if (success) {
            setIsDeleteOpen(false);
            setRoles((prev) => prev.filter((item) => item.id !== selectedRow.id));
            setSelectedRow(null);
        }
    };

    if (loadingRoles) {
        return <FullPageLoader />;
    }

    return (
        <div className="p-4 min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
            {/* Header */}
            <div className="p-6 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                            <Shield className="h-8 w-8 text-indigo-600" />
                            Role Management
                        </h2>
                        <p className="text-gray-600 mt-1">Manage admin roles and their permissions</p>
                    </div>
                    <Link
                        to="add"
                        className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
                    >
                        <Plus className="h-5 w-5" />
                        Add New Role
                    </Link>
                </div>

                {/* Roles Grid */}
                {roles.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                            <Lock className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-700">No roles created yet</h3>
                        <p className="text-gray-500 mt-2">Create your first role to get started</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {roles.map((role) => (
                            <Card
                                key={role.id}
                                className="group relative overflow-hidden border border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 bg-white"
                            >
                                <CardHeader className="">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                                                <Shield className="h-6 w-6 text-indigo-600" />
                                            </div>
                                            <CardTitle className="text-lg font-bold text-gray-800">
                                                {role.name}
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-600 font-medium mb-2">Permissions</p>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                                                    {role.permissions_count} active
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Preview first 3 permissions */}
                                        {role.permissions.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {role.permissions.slice(0, 3).map((p, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full"
                                                    >
                                                        {typeof p === 'string' ? p : p.name}
                                                    </span>
                                                ))}
                                                {role.permissions.length > 3 && (
                                                    <span className="text-xs text-gray-500">
                                                        +{role.permissions.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-4 border-t border-gray-100 bg-gray-50/50">
                                    <div className="flex w-full gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleOpenDetails(role)}
                                            className="flex-1"
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            View
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => handleEdit(role)}
                                            className="flex-1 text-white bg-indigo-600 hover:bg-indigo-700"
                                        >
                                            <Edit className="h-4 w-4 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(role)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Dialog */}
            <DeleteDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onDelete={handleDeleteConfirm}
                name={selectedRow?.name}
                isLoading={loadingDelete}
            />

            {/* Role Details Dialog (unchanged - still beautiful) */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="w-full bg-white rounded-xl shadow-xl p-0 sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <Shield className="h-5 w-5 text-blue-600" />
                                Role Details
                            </DialogTitle>
                            <DialogDescription className="text-sm text-gray-600 mt-1">
                                Comprehensive information and assigned permissions for the selected role
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    {selectedRow && (
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="mb-8 pb-6 border-b border-gray-100">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Users className="h-5 w-3 text-blue-600" />
                                    {selectedRow.name}
                                </h3>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-600 mb-1">Total Permissions</p>
                                    <p className="text-2xl font-bold text-indigo-700">{selectedRow.permissions_count}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <Eye className="h-4 w-4 text-green-600" />
                                    Assigned Permissions
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedRow.permissions && selectedRow.permissions.length > 0 ? (
                                        selectedRow.permissions.map((p, index) => (
                                            <span
                                                key={p.id || index}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                            >
                                                {p.name || p}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">No specific permissions assigned.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                        <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Roles;