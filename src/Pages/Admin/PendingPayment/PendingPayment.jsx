import React, { useState, useEffect } from "react";
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGet } from '@/Hooks/UseGet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FullPageLoader from "@/components/Loading";
import { useChangeState } from "@/Hooks/useChangeState";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

const PendingPayment = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    // API hooks for different endpoints
    const { refetch: refetchPending, loading: loadingPending, data: pendingData } = useGet({ url: `${apiUrl}/admin/getPendingPyament` });
    const { loadingChange, changeState } = useChangeState();

    // State for table data
    const [pendingRequests, setPendingRequests] = useState([]);

    // State for confirmation modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null); // 'accept' or 'reject'
    const [selectedItemId, setSelectedItemId] = useState(null);

    // State for receipt image modal
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedReceiptUrl, setSelectedReceiptUrl] = useState(null);

    // Common columns for all tables
    const Columns = [
        { key: "user_name", label: "User Name" },
        { key: "phone", label: "Phone" },
        { key: "plan_name", label: "Plan" },
        { key: "plan_price", label: "Price" },
        { key: "company", label: "Company" },
        { key: "payment_method", label: "Payment Method" },
    ];

    // Columns for pending table with action and receipt
    const PendingColumns = [
        ...Columns,
        { key: "receipt", label: "Receipt" },
        { key: "action", label: "Action" },
    ];

    // Effect to fetch data on mount
    useEffect(() => {
        refetchPending();
    }, [refetchPending]);

    // Format pending data
    useEffect(() => {
        if (pendingData?.pending_payment_requests && Array.isArray(pendingData.pending_payment_requests)) {
            const formatted = pendingData.pending_payment_requests.map((u) => ({
                id: u.id,
                user_name: `${u?.empeloyee?.first_name} ${u?.empeloyee.last_name}` || "—",
                phone: u?.empeloyee.phone || "—",
                plan_name: u?.plan?.name || "—",
                plan_price: u?.plan?.price_after_discount || "—",
                company: u?.company?.name || "—",
                payment_method: u?.payment_method?.name || "—",
                receipt: u?.receipt_image_link || "—",
            }));
            setPendingRequests(formatted);
        } else {
            setPendingRequests([]);
        }
    }, [pendingData]);

    // Handle opening the confirmation modal
    const openConfirmationModal = (id, action) => {
        setSelectedItemId(id);
        setModalAction(action);
        setIsModalOpen(true);
    };

    // Handle closing the confirmation modal
    const closeConfirmationModal = () => {
        setIsModalOpen(false);
        setSelectedItemId(null);
        setModalAction(null);
    };

    // Handle opening the receipt image modal
    const openImageModal = (receiptUrl) => {
        setSelectedReceiptUrl(receiptUrl);
        setIsImageModalOpen(true);
    };

    // Handle closing the receipt image modal
    const closeImageModal = () => {
        setIsImageModalOpen(false);
        setSelectedReceiptUrl(null);
    };

    // Handle accept/reject actions after confirmation
    const handleAction = async () => {
        if (!selectedItemId || !modalAction) return;

        const url = modalAction === 'accept'
            ? `${apiUrl}/admin/acceptPendingPyament/${selectedItemId}`
            : `${apiUrl}/admin/rejectPendingPyament/${selectedItemId}`;

        const success = await changeState(
            url,
            `${modalAction === 'accept' ? 'Accepted' : 'Rejected'} Successfully.`,
            {}
        );

        if (success) {
            setPendingRequests((prev) => prev.filter((item) => item.id !== selectedItemId));
            closeConfirmationModal();
        }
    };

    // Handle edit action
    const handleEdit = (item) => navigate(`add`, { state: { itemData: item } });

    // Render action buttons for pending table
    const renderActionCell = (item) => (
        <div className="flex gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => openConfirmationModal(item.id, 'accept')}
                className="bg-green-500 text-white hover:bg-green-600"
            >
                Accept
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => openConfirmationModal(item.id, 'reject')}
                className="bg-red-500 text-white hover:bg-red-600"
            >
                Reject
            </Button>
        </div>
    );

    // Render receipt cell with View link
    const renderReceiptCell = (item) => (
        <div>
            {item.receipt && item.receipt !== "—" ? (
                <button
                    onClick={() => openImageModal(item.receipt)}
                    className="text-blue-600 hover:underline"
                >
                    View
                </button>
            ) : (
                "—"
            )}
        </div>
    );

    // Filter keys for table filtering
    const filterKeys = ["payment_method"];

    // Titles for filter placeholders
    const titles = {
        payment_method: "Payment Method",
    };

    return (
        <div className="p-4">
            {loadingPending || loadingChange ? (
                <FullPageLoader />
            ) : (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl text-bg-primary font-bold">Pending Payment</h2>
                    </div>

                    <Table
                        data={pendingRequests}
                        columns={PendingColumns}
                        filterKeys={filterKeys}
                        titles={titles}
                        statusKey="email_verified"
                        onEdit={handleEdit}
                        renderActionCell={renderActionCell}
                        renderReceiptCell={renderReceiptCell} // Add custom render for receipt
                        actionsButtons={false}
                    />

                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogContent className="bg-white">
                            <DialogHeader>
                                <DialogTitle>
                                    {modalAction === 'accept' ? 'Confirm Accept' : 'Confirm Reject'}
                                </DialogTitle>
                            </DialogHeader>
                            <p>
                                Are you sure you want to {modalAction === 'accept' ? 'accept' : 'reject'} this Pending Payment?
                            </p>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={closeConfirmationModal}
                                    className="bg-gray-300 text-black hover:bg-gray-400"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleAction}
                                    className={`${modalAction === 'accept'
                                        ? 'bg-green-500 hover:bg-green-600'
                                        : 'bg-red-500 hover:bg-red-600'
                                        } text-white`}
                                >
                                    Confirm
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
                        <DialogContent className="bg-white max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>Receipt Image</DialogTitle>
                            </DialogHeader>
                            <div className="flex justify-center">
                                {selectedReceiptUrl && selectedReceiptUrl !== "—" ? (
                                    <img
                                        src={selectedReceiptUrl}
                                        alt="Receipt"
                                        className="max-w-full max-h-[70vh] object-contain"
                                        onError={(e) => (e.target.src = "/placeholder-image.png")} // Fallback for invalid URLs
                                    />
                                ) : (
                                    <p className="text-gray-500">No receipt image available</p>
                                )}
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={closeImageModal}
                                    className="bg-gray-300 text-black hover:bg-gray-400"
                                >
                                    Close
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </div>
    );
};

export default PendingPayment;