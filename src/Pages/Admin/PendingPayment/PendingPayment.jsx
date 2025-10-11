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
import { Input } from "@/components/ui/input";

const PendingPayment = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    const { refetch: refetchPending, loading: loadingPending, data: pendingData } = useGet({ url: `${apiUrl}/admin/getPendingPyament` });
    const { refetch: refetchApproved, loading: loadingApproved, data: approvedData } = useGet({ url: `${apiUrl}/admin/getApprovedPyament` });
    const { refetch: refetchRejected, loading: loadingRejected, data: rejectedData } = useGet({ url: `${apiUrl}/admin/getRejectedPyament` });
    const { loadingChange, changeState } = useChangeState();

    const [pendingRequests, setPendingRequests] = useState([]);
    const [approvedRequests, setApprovedRequests] = useState([]);
    const [rejectedRequests, setRejectedRequests] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");

    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedReceiptUrl, setSelectedReceiptUrl] = useState(null);

    const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");

    const [activeTab, setActiveTab] = useState("pending");

    useEffect(() => {
        refetchPending();
        refetchApproved();
        refetchRejected();
    }, [refetchPending, refetchApproved, refetchRejected]);

    useEffect(() => {
        if (pendingData?.pending_payment_requests && Array.isArray(pendingData.pending_payment_requests)) {
            const formatted = pendingData.pending_payment_requests.map((u) => {
                return {
                    id: u.id,
                    user_name: u.empeloyee?.full_name || `${u.empeloyee?.first_name} ${u.empeloyee?.last_name}` || "—",
                    phone: u.empeloyee?.phone || '—',
                    plan_name: u?.plan?.name || '—',
                    plan_price: u?.plan?.price_after_discount || '—',
                    company: u?.company?.name || '—',
                    payment_method: u?.payment_method?.name || '—',
                    receipt: u?.receipt_image_link || '—',
                };
            });
            setPendingRequests(formatted);
        } else {
            setPendingRequests([]);
        }
    }, [pendingData]);

    useEffect(() => {
        if (approvedData?.Approved_payment_requests && Array.isArray(approvedData?.Approved_payment_requests)) {
            const formatted = approvedData.Approved_payment_requests.map((u) => {
                return {
                    id: u.id,
                    user_name: u.empeloyee?.full_name || `${u.empeloyee?.first_name} ${u.empeloyee?.last_name}` || "—",
                    phone: u.empeloyee?.phone || '—',
                    plan_name: u?.plan?.name || '—',
                    plan_price: u?.plan?.price_after_discount || '—',
                    company: u?.company?.name || '—',
                    payment_method: u?.payment_method?.name || '—',
                    receipt: u?.receipt_image_link || '—',
                };
            });
            setApprovedRequests(formatted);
        } else {
            setApprovedRequests([]);
        }
    }, [approvedData]);

    useEffect(() => {
        if (rejectedData?.rejected_payment_requests && Array.isArray(rejectedData?.rejected_payment_requests)) {
            const formatted = rejectedData.rejected_payment_requests.map((u) => {
                return {
                    id: u.id,
                    user_name: u.empeloyee?.full_name || `${u.empeloyee?.first_name} ${u.empeloyee?.last_name}` || "—",
                    phone: u.empeloyee?.phone || '—',
                    plan_name: u?.plan?.name || '—',
                    plan_price: u?.plan?.price_after_discount || '—',
                    company: u?.company?.name || '—',
                    payment_method: u?.payment_method?.name || '—',
                    receipt: u?.receipt_image_link || '—',
                    reason: u?.reject_reason || '—',
                };
            });
            setRejectedRequests(formatted);
        } else {
            setRejectedRequests([]);
        }
    }, [rejectedData]);

    const Columns = [
        { key: "user_name", label: "User Name" },
        { key: "phone", label: "Phone" },
        { key: "plan_name", label: "Plan" },
        { key: "plan_price", label: "Price" },
        { key: "company", label: "Organization" },
        { key: "payment_method", label: "Payment Method" },
        { key: "receipt", label: "Receipt" },
    ];

    const PendingColumns = [
        ...Columns,
        { key: "action", label: "Action" },
    ];

    const RejectedColumns = [
        ...Columns,
        { key: "reason", label: "Reason" },
        { key: "action", label: "Action" },
    ];

    const openConfirmationModal = (id, action) => {
        setSelectedItemId(id);
        setModalAction(action);
        setRejectionReason("");
        setIsModalOpen(true);
    };

    const closeConfirmationModal = () => {
        setIsModalOpen(false);
        setSelectedItemId(null);
        setModalAction(null);
        setRejectionReason("");
    };

    const openImageModal = (receiptUrl) => {
        setSelectedReceiptUrl(receiptUrl);
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
        setSelectedReceiptUrl(null);
    };

    const openReasonModal = (reason) => {
        setSelectedReason(reason);
        setIsReasonModalOpen(true);
    };

    const closeReasonModal = () => {
        setIsReasonModalOpen(false);
        setSelectedReason("");
    };

    const handleAction = async () => {
        if (!selectedItemId || !modalAction) return;

        const url = modalAction === 'accept'
            ? `${apiUrl}/admin/acceptPendingPyament/${selectedItemId}`
            : `${apiUrl}/admin/rejectPendingPyament/${selectedItemId}`;

        const payload = modalAction === 'reject' ? { reason: rejectionReason } : {};

        const success = await changeState(
            url,
            `${modalAction === 'accept' ? 'Accepted' : 'Rejected'} Successfully.`,
            payload
        );

        if (success) {
            if (modalAction === 'accept') {
                setPendingRequests((prev) => prev.filter((item) => item.id !== selectedItemId));
                setRejectedRequests((prev) => prev.filter((item) => item.id !== selectedItemId));
                refetchApproved();
            } else {
                setPendingRequests((prev) => prev.filter((item) => item.id !== selectedItemId));
                refetchRejected();
            }
            closeConfirmationModal();
        }
    };

    const handleEdit = (item) => navigate(`add`, { state: { itemData: item } });

    const renderActionCell = (item, tab) => (
        <div className="flex gap-2">
            {tab === 'pending' ? (
                <>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openConfirmationModal(item.id, 'accept')}
                        className="bg-green-500 text-white hover:bg-green-600"
                    >
                        Approve
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openConfirmationModal(item.id, 'reject')}
                        className="bg-red-500 text-white hover:bg-red-600"
                    >
                        Reject
                    </Button>
                </>
            ) : (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openConfirmationModal(item.id, 'accept')}
                    className="bg-green-500 text-white hover:bg-green-600"
                >
                    Approve
                </Button>
            )}
        </div>
    );

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

    const renderReasonCell = (item) => (
        <div>
            {item.reason && item.reason !== "—" ? (
                <button
                    onClick={() => openReasonModal(item.reason)}
                    className="text-blue-600 hover:underline"
                >
                    Details
                </button>
            ) : (
                "—"
            )}
        </div>
    );

     const getTitleText = () => {
        switch (activeTab) {
            case "pending":
                return "Pending Payment";
            case "approved":
                return "Approved Payment";
            case "rejected":
                return "Rejected Payment";
            default:
                return "Pending Payment";
        }
    };

    const filterKeys = ["payment_method"];
    const titles = { payment_method: "Payment Method" };

    return (
        <div className="p-4">
            {loadingPending || loadingApproved || loadingRejected || loadingChange ? (
                <FullPageLoader />
            ) : (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl text-bg-primary font-bold">{getTitleText()}</h2>
                    </div>

                    <Tabs defaultValue="pending" className="w-full" onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger className="p-3 font-semibold text-base" value="pending">Pending</TabsTrigger>
                            <TabsTrigger className="p-3 font-semibold text-base" value="approved">Approved</TabsTrigger>
                            <TabsTrigger className="p-3 font-semibold text-base" value="rejected">Rejected</TabsTrigger>
                        </TabsList>

                        <TabsContent value="pending">
                            <Table
                                data={pendingRequests}
                                columns={PendingColumns}
                                filterKeys={filterKeys}
                                onEdit={handleEdit}
                                renderActionCell={(item) => renderActionCell(item, 'pending')}
                                renderReceiptCell={renderReceiptCell}
                                actionsButtons={false}
                            />
                        </TabsContent>

                        <TabsContent value="approved">
                            <Table
                                data={approvedRequests}
                                columns={Columns}
                                filterKeys={filterKeys}
                                onEdit={handleEdit}
                                renderReceiptCell={renderReceiptCell}
                                actionsButtons={false}
                            />
                        </TabsContent>

                        <TabsContent value="rejected">
                            <Table
                                data={rejectedRequests}
                                columns={RejectedColumns}
                                filterKeys={filterKeys}
                                onEdit={handleEdit}
                                renderActionCell={(item) => renderActionCell(item, 'rejected')}
                                renderReceiptCell={renderReceiptCell}
                                renderReasonCell={renderReasonCell}
                                actionsButtons={false}
                            />
                        </TabsContent>
                    </Tabs>

                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogContent className="bg-white">
                            <DialogHeader>
                                <DialogTitle>
                                    {modalAction === 'accept' ? 'Confirm Approve' : 'Confirm Reject'}
                                </DialogTitle>
                            </DialogHeader>
                            <div>
                                <p>
                                    Are you sure you want to {modalAction === 'accept' ? 'approve' : 'reject'} this payment request?
                                </p>
                                {modalAction === 'reject' && (
                                    <div className="mt-4">
                                        <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700">
                                            Reason for Rejection
                                        </label>
                                        <Input
                                            id="rejectionReason"
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            placeholder="Enter reason for rejection"
                                            className="mt-1 p-2"
                                        />
                                    </div>
                                )}
                            </div>
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
                                    disabled={modalAction === 'reject' && !rejectionReason.trim()}
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

                    <Dialog open={isReasonModalOpen} onOpenChange={setIsReasonModalOpen}>
                        <DialogContent className="bg-white">
                            <DialogHeader>
                                <DialogTitle>Rejection Reason</DialogTitle>
                            </DialogHeader>
                            <div>
                                <p className="text-gray-700">{selectedReason || "No reason provided"}</p>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={closeReasonModal}
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