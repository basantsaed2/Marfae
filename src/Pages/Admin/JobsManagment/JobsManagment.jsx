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
    const apiUrl = 'https://backMarfea.marfaa-alex.com/api';
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
                title: j.title || "—",
                company: j.company?.name || "—",
                job_category: j.job_category?.name || "—",
                city: j.city?.name || "—",
                zone: j.zone?.name || "—",
                type: j.type || "—",
                level: j.level || "—",
                status: j.status === "active" ? "Active" : "Inactive",
                description: j.description || "—",
                qualifications: j.qualifications || "—",
                min_expected_salary: j.min_expected_salary || "—",
                max_expected_salary: j.max_expected_salary || "—",
                expire_date: j.expire_date || "—",
                location_link: j.location_link || "—",
                image_link: j.image_link || "—",
                company_id: j.company_id || "—",
                job_category_id: j.job_category_id || "—",
                city_id: j.city_id || "—",
                zone_id: j.zone_id || "—",
                created_at: j.created_at || "—",
                updated_at: j.updated_at || "—",
            }));
            setJobs(formatted);
        }
    }, [dataJobs]);

    const Columns = [
        // {
        //   key: "image_link",
        //   label: "Image",
        //   render: (item) => (
        //     item.image_link && item.image_link !== "—" ? (
        //       <img
        //         src={item.image_link}
        //         alt={item.title}
        //         className="w-12 h-12 object-cover rounded-md"
        //       />
        //     ) : (
        //       <Avatar className="w-12 h-12">
        //         <AvatarFallback>{item.title?.charAt(0) || "—"}</AvatarFallback>
        //       </Avatar>
        //     )
        //   ),
        // },
        { key: "title", label: "Job Title" },
        { key: "company", label: "Company" },
        { key: "job_category", label: "Category" },
        { key: "city", label: "City" },
        { key: "zone", label: "Zone" },
        { key: "type", label: "Type" },
        { key: "level", label: "Level" },
        { key: "status", label: "Status" },
        // {
        //   key: "details",
        //   label: "Details",
        //   render: (item) => (
        //     <Button
        //       variant="outline"
        //       size="sm"
        //       onClick={() => {
        //         setSelectedRow(item);
        //         setIsDetailsOpen(true);
        //       }}
        //     >
        //       <Info className="h-4 w-4 mr-2" /> View
        //     </Button>
        //   ),
        // },
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
                    filterKeys={["title", "company", "job_category"]}
                    titles={{ title: "Job Title" }}
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
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{selectedRow?.title} Details</DialogTitle>
                        <DialogDescription>View all details for the selected job.</DialogDescription>
                    </DialogHeader>
                    {selectedRow && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">Image:</span>
                                <div className="col-span-3">
                                    {selectedRow.image_link && selectedRow.image_link !== "—" ? (
                                        <img
                                            src={selectedRow.image_link}
                                            alt={selectedRow.title}
                                            className="w-16 h-16 object-cover rounded-md"
                                        />
                                    ) : (
                                        <Avatar className="w-16 h-16">
                                            <AvatarFallback>{selectedRow.title?.charAt(0) || "—"}</AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">Title:</span>
                                <span className="col-span-3">{selectedRow.title}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">Company:</span>
                                <span className="col-span-3">{selectedRow.company}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">Category:</span>
                                <span className="col-span-3">{selectedRow.job_category}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">City:</span>
                                <span className="col-span-3">{selectedRow.city}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">Zone:</span>
                                <span className="col-span-3">{selectedRow.zone}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">Type:</span>
                                <span className="col-span-3">{selectedRow.type}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">Level:</span>
                                <span className="col-span-3">{selectedRow.level}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">Status:</span>
                                <span className="col-span-3">{selectedRow.status}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">Description:</span>
                                <span className="col-span-3">{selectedRow.description}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">Qualifications:</span>
                                <span className="col-span-3">{selectedRow.qualifications}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">Min Salary:</span>
                                <span className="col-span-3">{selectedRow.min_expected_salary}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">Max Salary:</span>
                                <span className="col-span-3">{selectedRow.max_expected_salary}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">Expiration Date:</span>
                                <span className="col-span-3">{selectedRow.expire_date}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">Location Link:</span>
                                <span className="col-span-3">
                                    <a href={selectedRow.location_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        {selectedRow.location_link || "—"}
                                    </a>
                                </span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span-1">Created At:</span>
                                <span className="col-span-3">{selectedRow.created_at}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-medium col-span- Paralle">Updated At:</span>
                                <span className="col-span-3">{selectedRow.updated_at}</span>
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

export default JobManagement;