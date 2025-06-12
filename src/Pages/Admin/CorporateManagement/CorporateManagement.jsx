import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGet } from '@/Hooks/UseGet';
import { useChangeState } from '@/Hooks/useChangeState';
import DeleteDialog from '@/components/DeleteDialog';
import FullPageLoader from "@/components/Loading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useDelete } from "@/Hooks/useDelete";

const CorporateManagement = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchCompanies, loading: loadingCompanies, data: dataCompanies } = useGet({ url: `${apiUrl}/admin/getCompanies` });
    const { loadingChange, changeState } = useChangeState();
    const { deleteData, loadingDelete } = useDelete();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [companies, setCompanies] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        refetchCompanies();
    }, [refetchCompanies]);

    useEffect(() => {
        if (dataCompanies && dataCompanies.companies) {
            const formatted = dataCompanies.companies.map((c) => ({
                id: c.id || "—",
                name: c.name || "—",
                // img: c.image_link ? (
                //     <img
                //         src={c.image_link}
                //         alt={c.name}
                //         className="w-12 h-12 object-cover rounded-md"
                //     />
                // ) : (
                //     <Avatar className="w-12 h-12">
                //         <AvatarFallback>{c.name?.charAt(0)}</AvatarFallback>
                //     </Avatar>
                // ),
                email: c.email || "—",
                phone: c.phone || "—",
                type: c.type || "—",
                specializations: Array.isArray(c.company_specializations)
                    ? c.company_specializations.map((s) => s.name || s).join(", ") || "—"
                    : "—",
                location_link: c.location_link || "—",
                description: c.description || "—",
                facebook_link: c.facebook_link || "—",
                twitter_link: c.twitter_link || "—",
                linkedin_link: c.linkedin_link || "—",
                site_link: c.site_link || "—",
                status: c.status === "active" ? "Active" : "Inactive",
                start_date: c.start_date || "—",
                end_date: c.end_date || "—",
                user_id: c.user_id || "—",
                user: c.user || "—",
            }));
            setCompanies(formatted);
        }
    }, [dataCompanies]);

    const Columns = [

        { key: "name", label: "Company Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "type", label: "Type" },
        { key: "specializations", label: "Specializations" },
        { key: "status", label: "Status" },
        // {
        //     key: "details",
        //     label: "Details",
        //     render: (item) => (
        //         <Button
        //             variant="outline"
        //             size="sm"
        //             onClick={() => {
        //                 setSelectedRow(item);
        //                 setIsDetailsOpen(true);
        //             }}
        //         >
        //             <Info className="h-4 w-4 mr-2" /> View
        //         </Button>
        //     ),
        // },
    ];

    const handleEdit = (item) => navigate(`add`, { state: { companyDetails: item } });

    const handleDelete = (item) => {
        setSelectedRow(item);
        setIsDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedRow) return;

        const success = await deleteData(
            `${apiUrl}/admin/deleteCompany/${selectedRow.id}`,
            `${selectedRow.name} Deleted Successfully.`
        );
        if (success) {
            setIsDeleteOpen(false);
            setCompanies((prev) => prev.filter((item) => item.id !== selectedRow.id));
            setSelectedRow(null);
        }

    };
    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl text-bg-primary font-bold">Company Management</h2>
                <Link
                    to="add"
                    className="flex justify-center items-center px-4 py-1 rounded-md text-base bg-bg-secondary font-semibold text-white hover:bg-bg-secondary/90"
                >
                    <Plus className="mr-2 h-4 w-4 text-white" /> Add Company
                </Link>
            </div>
            {loadingCompanies ? (
                <FullPageLoader />
            ) : (
                <Table
                    data={companies}
                    columns={Columns}
                    statusKey="status"
                    filterKeys={["name"]} // Exclude image_link from filtering
                    titles={{ name: "Company Name" }}
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
                isLoading={loadingChange}
            />
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{selectedRow?.name} Details</DialogTitle>
                        <DialogDescription>View all details for the selected company.</DialogDescription>
                    </DialogHeader>
                    {selectedRow && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">Logo:</span>
                                <div className="col-span-3">
                                    {selectedRow.image_link && selectedRow.image_link !== "—" ? (
                                        <img
                                            src={selectedRow.image_link}
                                            alt={selectedRow.name}
                                            className="w-16 h-16 object-cover rounded-md"
                                        />
                                    ) : (
                                        <Avatar className="w-16 h-16">
                                            <AvatarFallback>{selectedRow.name?.charAt(0) || "—"}</AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">Name:</span>
                                <span className="col-span-3">{selectedRow.name}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">Email:</span>
                                <span className="col-span-3">{selectedRow.email}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">Phone:</span>
                                <span className="col-span-3">{selectedRow.phone}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">Type:</span>
                                <span className="col-span-3">{selectedRow.type}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">Specializations:</span>
                                <span className="col-span-3">{selectedRow.specializations}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">Status:</span>
                                <span className="col-span-3">{selectedRow.status}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">Location:</span>
                                <span className="col-span-3">
                                    <a href={selectedRow.location_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        {selectedRow.location_link}
                                    </a>
                                </span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">Description:</span>
                                <span className="col-span-3">{selectedRow.description}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">Facebook:</span>
                                <span className="col-span-3">
                                    <a href={selectedRow.facebook_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        {selectedRow.facebook_link}
                                    </a>
                                </span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">Twitter:</span>
                                <span className="col-span-3">
                                    <a href={selectedRow.twitter_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        {selectedRow.twitter_link}
                                    </a>
                                </span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">LinkedIn:</span>
                                <span className="col-span-3">
                                    <a href={selectedRow.linkedin_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        {selectedRow.linkedin_link}
                                    </a>
                                </span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">Website:</span>
                                <span className="col-span-3">
                                    <a href={selectedRow.site_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        {selectedRow.site_link}
                                    </a>
                                </span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">Start Date:</span>
                                <span className="col-span-3">{selectedRow.start_date}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">End Date:</span>
                                <span className="col-span-3">{selectedRow.end_date}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">User ID:</span>
                                <span className="col-span-3">{selectedRow.user_id}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">User:</span>
                                <span className="col-span-3">{selectedRow.user}</span>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end">
                        <Button onClick={() => setIsDetailsOpen(false)}>Close</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CorporateManagement;