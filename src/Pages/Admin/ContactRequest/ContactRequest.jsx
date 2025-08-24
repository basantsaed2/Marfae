import React, { useState, useEffect } from "react";
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useGet } from '@/Hooks/UseGet';
import { useChangeState } from '@/Hooks/useChangeState';
import FullPageLoader from "@/components/Loading";
import { toast, ToastContainer } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const ContactRequest = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchCV, loading: loadingCV, data: dataCV } = useGet({ url: `${apiUrl}/admin/getContactsRequests` });
    const { changeState, loadingChange } = useChangeState();
    const [solvedCV, setSolvedCV] = useState([]);
    const [unsolvedCV, setUnsolvedCV] = useState([]);
    const [activeTab, setActiveTab] = useState("unsolved");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [modalAction, setModalAction] = useState(null); // 'solved' or 'unsolved'

    useEffect(() => {
        refetchCV();
    }, [refetchCV]);

    useEffect(() => {
        if (dataCV && dataCV.solved && dataCV.unsolved) {
            const formattedSolved = dataCV.solved.map((j) => ({
                id: j.id || "—",
                full_name: j.full_name || "—",
                email: j.email || "—",
                subject: j.subject || "—",
                message: j.message || "—",
                status: j.status || "—",
                created_at: new Date(j.created_at).toLocaleDateString() || "—",
            }));
            const formattedUnsolved = dataCV.unsolved.map((j) => ({
                id: j.id || "—",
                full_name: j.full_name || "—",
                email: j.email || "—",
                subject: j.subject || "—",
                message: j.message || "—",
                status: j.status || "—",
                created_at: new Date(j.created_at).toLocaleDateString() || "—",
            }));
            setSolvedCV(formattedSolved);
            setUnsolvedCV(formattedUnsolved);
        }
    }, [dataCV]);

    const openConfirmationModal = (id, currentStatus) => {
        setSelectedItemId(id);
        setModalAction(currentStatus === "solved" ? "unsolved" : "solved");
        setIsModalOpen(true);
    };

    const closeConfirmationModal = () => {
        setIsModalOpen(false);
        setSelectedItemId(null);
        setModalAction(null);
    };

    const handleStatusToggle = async () => {
        if (!selectedItemId || !modalAction) return;

        const url = `${apiUrl}/admin/edit-contactus-request/${selectedItemId}`;
        const success = await changeState(url, `Status changed to ${modalAction}`, { status: modalAction });

        if (success) {
            if (modalAction === "solved") {
                const request = unsolvedCV.find(item => item.id === selectedItemId);
                setUnsolvedCV(unsolvedCV.filter(item => item.id !== selectedItemId));
                setSolvedCV([...solvedCV, { ...request, status: modalAction }]);
            } else {
                const request = solvedCV.find(item => item.id === selectedItemId);
                setSolvedCV(solvedCV.filter(item => item.id !== selectedItemId));
                setUnsolvedCV([...unsolvedCV, { ...request, status: modalAction }]);
            }
            refetchCV();
            closeConfirmationModal();
        }
    };

    const Columns = [
        { key: "full_name", label: "Full Name" },
        { key: "email", label: "Email" },
        { key: "subject", label: "Subject" },
        { key: "message", label: "Message" },
        { key: "created_at", label: "Created At" },
        { key: "action", label: "Action" },
    ];

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl md:text-2xl text-bg-primary font-bold">Contact Requests Management</h2>
            </div>

            <div className="mb-4">
                <button
                    onClick={() => handleTabChange("unsolved")}
                    className={`px-4 py-2 mr-2 rounded-md ${activeTab === "unsolved" ? "bg-bg-secondary text-white" : "bg-gray-200 text-black"}`}
                >
                    Unsolved ({unsolvedCV.length})
                </button>
                <button
                    onClick={() => handleTabChange("solved")}
                    className={`px-4 py-2 rounded-md ${activeTab === "solved" ? "bg-bg-secondary text-white" : "bg-gray-200 text-black"}`}
                >
                    Solved ({solvedCV.length})
                </button>
            </div>

            {loadingCV ? (
                <FullPageLoader />
            ) : (
                <Table
                    data={activeTab === "unsolved" ? unsolvedCV : solvedCV}
                    columns={Columns}
                    statusKey="status"
                    actionsButtons={false}
                    renderActionCell={(row) => (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openConfirmationModal(row.id, row.status)}
                            disabled={loadingChange}
                            className={`${
                                row.status === "solved" 
                                    ? "bg-red-500 text-white hover:bg-red-600" 
                                    : "bg-green-500 text-white hover:bg-green-600"
                            } ${loadingChange ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {row.status === "solved" ? "Mark Unsolved" : "Mark Solved"}
                        </Button>
                    )}
                    className="w-full bg-white rounded-lg shadow-md p-6"
                />
            )}

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>
                            Confirm Status Change
                        </DialogTitle>
                    </DialogHeader>
                    <div>
                        <p>
                            Are you sure you want to mark this request as {modalAction === "solved" ? "solved" : "unsolved"}?
                        </p>
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
                            onClick={handleStatusToggle}
                            className={`${
                                modalAction === "solved"
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-red-500 hover:bg-red-600"
                            } text-white`}
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ToastContainer />
        </div>
    );
};

export default ContactRequest;