import React, { useState, useEffect } from "react";
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Briefcase, Calendar, Circle, MapPin, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGet } from '@/Hooks/UseGet';
import { useDelete } from '@/Hooks/useDelete';
import DeleteDialog from '@/components/DeleteDialog';
import FullPageLoader from "@/components/Loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

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
                job_titel_id: j.job_titel_id?.toString() || "—",
                job_sub_title: j.job_sub_title?.sub_title_name || "—",
                job_sub_title_id: j.job_sub_title_id?.toString() || "—",
                company: j.company?.name || "—",
                job_category: j.job_category?.name || "—",
                city: j.city?.name || "—",
                zone: j.zone?.name || "—",
                type: j.type || "—",
                experience: j.experience || "—",
                description: j.description || "—",
                job_qualification_id: j.job_qualification_id || "—",
                qualifications: j.job_qualification?.name || "—",
                expected_salary: j.expected_salary || "—",
                expire_date: j.expire_date || "—",
                location_link: j.location_link || "—",
                company_id: j.company_id || "—",
                job_category_id: j.job_category_id || "—",
                city_id: j.city_id || "—",
                zone_id: j.zone_id || "—",
                status: j.status === "active" ? "Active" : "Inactive",
                img: j.image_link || "—", // Store the image URL or a placeholder string
                image: j.image || "—", // Use the image_l field for the avatar
            }));
            setJobs(formatted);
        }
    }, [dataJobs]);

    const Columns = [
        { key: "img", label: "Image" },
        { key: "title", label: "Job Title" },
        { key: "company", label: "Organization" },
        { key: "job_category", label: "Category" },
        { key: "city", label: "City" },
        { key: "zone", label: "Zone" },
        { key: "type", label: "Type" },
        { key: "experience", label: "Experience" },
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

    // Add this function to handle opening the details dialog
    const handleOpenDetails = (item) => {
        setSelectedRow(item);
        setIsDetailsOpen(true);
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
                    onView={handleOpenDetails} // Pass the handler to the Table
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

            {/* Enhanced Details dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="w-full bg-white rounded-xl shadow-xl p-0 sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-blue-600" />
                                Job Details
                            </DialogTitle>
                            <DialogDescription className="text-sm text-gray-600 mt-1">
                                Comprehensive information about the selected job posting
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    {selectedRow && (
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* Header with image and basic info */}
                            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-6 border-b border-gray-100">
                                <div className="flex-shrink-0">
                                    <Avatar className="h-20 w-20 rounded-xl border-4 border-white shadow-md">
                                        <AvatarImage
                                            src={selectedRow.image_link}
                                            alt={`${selectedRow.title} image`}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 text-lg font-semibold">
                                            {selectedRow.title?.charAt(0) || "J"}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                <div className="text-center sm:text-left">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedRow.title}</h2>
                                    <p className="text-lg text-gray-700 font-medium mb-2">{selectedRow.company}</p>
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            {selectedRow.city}, {selectedRow.zone}
                                        </span>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            {selectedRow.type}
                                        </span>
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

                            {/* Job Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="space-y-6">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Job Information</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Category</p>
                                                <p className="text-gray-900 font-medium">{selectedRow.job_category}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Sub Title</p>
                                                <p className="text-gray-900 font-medium">{selectedRow.job_sub_title}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Experience Level</p>
                                                <p className="text-gray-900 font-medium">{selectedRow.experience}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Expected Salary</p>
                                                <p className="text-gray-900 font-medium">{selectedRow.expected_salary}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Timeline</h3>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Application Deadline</p>
                                            <p className="text-gray-900 font-medium flex items-center gap-1">
                                                <Calendar className="h-4 w-4 text-gray-500" />
                                                {selectedRow.expire_date}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <h3 className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">Job Description</h3>
                                        <p className="text-gray-700 whitespace-pre-line">{selectedRow.description}</p>
                                    </div>

                                    <div className="p-4 bg-indigo-50 rounded-lg">
                                        <h3 className="text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-2">Qualifications</h3>
                                        <p className="text-gray-700 whitespace-pre-line">{selectedRow.qualifications}</p>
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

export default JobManagement;