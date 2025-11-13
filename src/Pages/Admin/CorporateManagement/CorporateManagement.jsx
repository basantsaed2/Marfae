import React, { useState, useEffect } from "react";
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Briefcase, Calendar, Circle, FileText, Info, LinkIcon, MapPin, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGet } from '@/Hooks/UseGet';
import { useChangeState } from '@/Hooks/useChangeState';
import DeleteDialog from '@/components/DeleteDialog';
import FullPageLoader from "@/components/Loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
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
                email: c.email || "",
                phone: c.phone || "",
                img:c.image_link || '',
                type: c.company_type?.name || "", // String, e.g., "Medical"
                specializations: Array.isArray(c.company_specializations)
                    ? c.company_specializations.map((s) => ({
                        id: s.specialization_id,
                        name: s.specialization?.name || "",
                    }))
                    : [],
                specializationsDisplay: Array.isArray(c.company_specializations)
                    ? c.company_specializations
                        .map((s) => s.specialization?.name || "")
                        .join(", ") || ""
                    : "—",
                location_link: c.location_link || "",
                description: c.description || "",
                facebook_link: c.facebook_link || "",
                twitter_link: c.twitter_link || "",
                linkedin_link: c.linkedin_link || "",
                site_link: c.site_link || "",
                status: c.status === "active" ? "Active" : "Inactive",
                start_date: c.start_date || "",
                end_date: c.end_date || "",
                user_id: c.user_id || "",
                user: c.user || "",
                company_type: c.company_type || { name: "—" }, // Object, e.g., { id: 1, name: "Medical" }
                company_specializations: c.company_specializations || [],
                country_id:c.country_id,
                city_id:c.city_id,
                country:c.country?.name,
                city:c.city?.name
            }));
            setCompanies(formatted);
        }
    }, [dataCompanies]);
    const Columns = [
        { key: "img", label: "Image" },
        { key: "name", label: "Organization Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "type", label: "Type" },
        { key: "specializationsDisplay", label: "Specializations" },
        { 
        key: "employers", 
        label: "Employers",
        renderCell: (item) => (
            <Link 
                to={`employers/${item.id}`}
                className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
                View Employers
            </Link>
        )
    },
        { key: "status", label: "Status" },
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


    // Add this function to handle opening the details dialog
    const handleOpenDetails = (item) => {
        setSelectedRow(item);
        setIsDetailsOpen(true);
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl text-bg-primary font-bold">Organization Management</h2>
                <Link
                    to="add"
                    className="flex justify-center items-center px-4 py-1 rounded-md text-base bg-bg-secondary font-semibold text-white hover:bg-bg-secondary/90"
                >
                    <Plus className="mr-2 h-4 w-4 text-white" /> Add Organization
                </Link>
            </div>
            {loadingCompanies ? (
                <FullPageLoader />
            ) : (
                <Table
                    data={companies}
                    columns={Columns}
                    statusKey="status"
                    // filterKeys={["name"]} // Exclude image_link from filtering
                    // titles={{ name: "Company Name" }}
                    onEdit={(item) => handleEdit({ ...item })}
                    onView={(item) => handleOpenDetails({ ...item })} // Pass the handler to the Table
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
            {/* Company Details Dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="w-full bg-white rounded-xl shadow-xl p-0 sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-blue-600" />
                                Organization Details
                            </DialogTitle>
                            <DialogDescription className="text-sm text-gray-600 mt-1">
                                Comprehensive information about the selected Organization
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    {selectedRow && (
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-6 border-b border-gray-100">
                                <div className="flex-shrink-0">
                                    <Avatar className="h-20 w-20 rounded-xl border-4 border-white shadow-md">
                                        <AvatarImage
                                            src={selectedRow.img}
                                            alt={`${selectedRow.name} image`}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 text-lg font-semibold">
                                            {selectedRow.name?.charAt(0) || "C"}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="text-center sm:text-left">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedRow.name}</h2>
                                    <p className="text-lg text-gray-700 font-medium mb-2">
                                        {selectedRow.type || "N/A"} {/* Fix: Use type instead of company_type */}
                                    </p>
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            City : {selectedRow.city}, Country : {selectedRow.country}
                                        </span>
                                        {selectedRow.specializations && selectedRow.specializations.length > 0 ? (
                                            selectedRow.specializations.map((spec, index) => (
                                                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    {spec.name || "N/A"} {/* Fix: Use specializations array */}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                No Specializations
                                            </span>
                                        )}
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${selectedRow.status === "Active"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            <Circle className="h-2 w-2 mr-1 fill-current" />
                                            {selectedRow.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="space-y-6">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                            <Info className="h-4 w-4" />
                                            Organization Information
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Type</p>
                                                <p className="text-gray-900 font-medium">{selectedRow.type || "N/A"}</p> {/* Fix: Use type */}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Specializations</p>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {selectedRow.specializations && selectedRow.specializations.length > 0 ? (
                                                        selectedRow.specializations.map((spec, index) => (
                                                            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                                                                {spec.name || "N/A"} {/* Fix: Use specializations */}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-500 text-sm">No specializations</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Email</p>
                                                <p className="text-gray-900 font-medium">{selectedRow.email || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Phone</p>
                                                <p className="text-gray-900 font-medium">{selectedRow.phone || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                        <Button
                            variant="outline"
                            onClick={() => setIsDetailsOpen(false)}
                            className="rounded-lg border-gray-300"
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CorporateManagement;