import React, { useState, useEffect } from "react";
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useGet } from '@/Hooks/UseGet';
import DeleteDialog from '@/components/DeleteDialog';
import FullPageLoader from "@/components/Loading";
import { Plus, Mail, Phone, User, Calendar, MapPin, Briefcase, Award, Circle, Building, Users, Clock, Map } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useDelete } from "@/Hooks/useDelete";

const Doctors = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchDoctor, loading: loadingDoctor, data: dataDoctor } = useGet({ url: `${apiUrl}/admin/get-doctor-list` });
    const { deleteData, loadingDelete } = useDelete();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        refetchDoctor();
    }, [refetchDoctor]);

    useEffect(() => {
        if (dataDoctor && dataDoctor.doctors) {
            const formatted = dataDoctor.doctors.map((doctor) => ({
                id: doctor.id,
                doctor_name: doctor.doctor_name || "—",
                clinic_name: doctor.clinic_name || "—",
                phone: doctor.phone || "—",
                email: doctor.email || "—",
                country: doctor.country?.name || "—",
                city: doctor.city?.name || "—",
                zone: doctor.zone?.name || "—",
                specialization: doctor.specialization?.name || "—",
                specialization_id: doctor.specialization_id,
                country_id: doctor.country_id,
                city_id: doctor.city_id,
                zone_id: doctor.zone_id,
                availability_days: Array.isArray(doctor.availability_days) ? doctor.availability_days : [],
                available_start_time: doctor.available_start_time || "—",
                available_end_time: doctor.available_end_time || "—",
                doctor_image: doctor.doctor_image || "",
                img: doctor.doctor_image_url || "",
                status: doctor.status === "active" ? "Active" : "Inactive",
            }));
            setDoctors(formatted);
        }
    }, [dataDoctor]);

    const columns = [
        { key: "img", label: "Image", type: "image" },
        { key: "doctor_name", label: "Doctor Name" },
        { key: "specialization", label: "Specialization" },
        { key: "clinic_name", label: "Clinic" },
        { key: "city", label: "City" },
        { key: "available_start_time", label: "Start Time" },
        { key: "available_end_time", label: "End Time" },
        // { key: "status", label: "Status" },
    ];

    const handleEdit = (item) => navigate(`add`, { state: { itemData: item } });

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
            `${apiUrl}/admin/delete-doctor/${selectedRow.id}`,
            `${selectedRow.doctor_name} Deleted Successfully.`,
            {}
        );

        if (success) {
            setIsDeleteOpen(false);
            setDoctors((prev) => prev.filter((item) => item.id !== selectedRow.id));
            setSelectedRow(null);
        }
    };

    // Helper function to format time display
    const formatTimeDisplay = (timeString) => {
        if (!timeString || timeString === "—") return "—";

        // Remove seconds if present
        return timeString.split(':').slice(0, 2).join(':');
    };

    // Helper function to format availability days
    const formatAvailabilityDays = (days) => {
        if (!Array.isArray(days) || days.length === 0) return "—";

        return days.map(day =>
            day.charAt(0).toUpperCase() + day.slice(1)
        ).join(', ');
    };

    // Get status badge color
    const getStatusBadgeColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl md:text-2xl text-bg-primary font-bold">Doctors List</h2>
                <Link
                    to="add"
                    className="flex justify-center items-center px-4 py-1 rounded-md text-base bg-bg-secondary font-semibold text-white hover:bg-bg-secondary/90"
                >
                    <Plus className="mr-2 h-4 w-4 text-white" /> Add Doctor
                </Link>
            </div>
            {loadingDoctor ? (
                <FullPageLoader />
            ) : (
                <Table
                    data={doctors}
                    columns={columns}
                    //   statusKey="status"
                    //   filterKeys={["status", "specialization", "city"]}
                    //   titles={{ status: "status" }}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleOpenDetails}
                    className="w-full bg-white rounded-lg shadow-md p-4 md:p-6"
                />
            )}
            <DeleteDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onDelete={handleDeleteConfirm}
                name={selectedRow?.doctor_name}
                isLoading={loadingDelete}
            />

            {/* Doctor Details Dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="w-full bg-white rounded-xl shadow-xl p-0 sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <User className="h-5 w-5 text-blue-600" />
                                Doctor Details
                            </DialogTitle>
                            <DialogDescription className="text-sm text-gray-600 mt-1">
                                Comprehensive information about the selected doctor
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    {selectedRow && (
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* Header with avatar and basic info */}
                            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-6 border-b border-gray-100">
                                <div className="flex-shrink-0">
                                    <Avatar className="h-20 w-20 rounded-xl border-4 border-white shadow-md">
                                        <AvatarImage
                                            src={selectedRow.img}
                                            alt={`${selectedRow.doctor_name} avatar`}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 text-lg font-semibold">
                                            {selectedRow.doctor_name?.charAt(0) || "D"}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                <div className="text-center sm:text-left">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedRow.doctor_name}</h2>
                                    <p className="text-lg text-gray-700 font-medium mb-2">{selectedRow.specialization}</p>

                                    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center sm:justify-start gap-2">
                                        {/* <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(selectedRow.status)}`}>
                                            <Circle className="h-2 w-2 mr-1 fill-current" />
                                            {selectedRow.status}
                                        </span> */}
                                        {selectedRow.clinic_name && selectedRow.clinic_name !== "—" && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                <Building className="h-3 w-3 mr-1" />
                                                {selectedRow.clinic_name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Doctor Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="space-y-6">
                                    {/* Contact Information */}
                                    {(selectedRow.email || selectedRow.phone) && (
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Contact Information</h3>
                                            <div className="space-y-4">
                                                {selectedRow.email && selectedRow.email !== "—" && (
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                                            <Mail className="h-4 w-4" />
                                                            Email
                                                        </p>
                                                        <p className="text-gray-900 font-medium mt-1">{selectedRow.email}</p>
                                                    </div>
                                                )}
                                                {selectedRow.phone && selectedRow.phone !== "—" && (
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                                            <Phone className="h-4 w-4" />
                                                            Phone
                                                        </p>
                                                        <p className="text-gray-900 font-medium mt-1">{selectedRow.phone}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Location Information */}
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <h3 className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            Location
                                        </h3>
                                        <div className="space-y-3">
                                            {selectedRow.country && selectedRow.country !== "—" && (
                                                <div>
                                                    <p className="text-sm font-medium text-blue-600">Country</p>
                                                    <p className="text-gray-900 font-medium">{selectedRow.country}</p>
                                                </div>
                                            )}
                                            {selectedRow.city && selectedRow.city !== "—" && (
                                                <div>
                                                    <p className="text-sm font-medium text-blue-600">City</p>
                                                    <p className="text-gray-900 font-medium">{selectedRow.city}</p>
                                                </div>
                                            )}
                                            {selectedRow.zone && selectedRow.zone !== "—" && (
                                                <div>
                                                    <p className="text-sm font-medium text-blue-600">Zone</p>
                                                    <p className="text-gray-900 font-medium">{selectedRow.zone}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Availability Information */}
                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <h3 className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            Availability
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm font-medium text-green-600">Working Hours</p>
                                                <p className="text-gray-900 font-medium">
                                                    {formatTimeDisplay(selectedRow.available_start_time)} - {formatTimeDisplay(selectedRow.available_end_time)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-green-600">Available Days</p>
                                                <p className="text-gray-900 font-medium">
                                                    {formatAvailabilityDays(selectedRow.availability_days)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Specialization Information */}
                                    <div className="p-4 bg-indigo-50 rounded-lg">
                                        <h3 className="text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <Award className="h-4 w-4" />
                                            Specialization
                                        </h3>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                {selectedRow.specialization}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Clinic Information */}
                                    {selectedRow.clinic_name && selectedRow.clinic_name !== "—" && (
                                        <div className="p-4 bg-purple-50 rounded-lg">
                                            <h3 className="text-xs font-semibold text-purple-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                <Building className="h-4 w-4" />
                                                Clinic
                                            </h3>
                                            <p className="text-gray-900 font-medium">{selectedRow.clinic_name}</p>
                                        </div>
                                    )}
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

export default Doctors;