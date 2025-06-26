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

const Requests = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  // API hooks for different endpoints
  const { refetch: refetchPending, loading: loadingPending, data: pendingData } = useGet({ url: `${apiUrl}/admin/getPendingEmployeer` });
  const { refetch: refetchApproved, loading: loadingApproved, data: approvedData } = useGet({ url: `${apiUrl}/admin/getApprovedEmployeer` });
  const { refetch: refetchRejected, loading: loadingRejected, data: rejectedData } = useGet({ url: `${apiUrl}/admin/getRejectedEmployeer` });
  const { loadingChange, changeState } = useChangeState();

  // State for table data
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);

  // State for confirmation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'accept' or 'reject'
  const [selectedItemId, setSelectedItemId] = useState(null);

  // Common columns for all tables
  const Columns = [
    { key: "full_name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "company", label: "Company" },
    { key: "email", label: "Email" },
    { key: "email_verified", label: "Email Verified" },
  ];

  // Columns for pending table with action
  const PendingColumns = [
    ...Columns,
    { key: "action", label: "Action" },
  ];

  // Effect to fetch data on mount
  useEffect(() => {
    refetchPending();
    refetchApproved();
    refetchRejected();
  }, [refetchPending, refetchApproved, refetchRejected]);

  // Format pending data
  useEffect(() => {
    if (pendingData?.pendingEmployeer && Array.isArray(pendingData.pendingEmployeer)) {
      const formatted = pendingData.pendingEmployeer.map((u) => ({
        id: u.id,
        full_name: u.full_name || `${u.first_name} ${u.last_name}` || "—",
        phone: u.phone || "—",
        company: u.company?.name || "—",
        email: u.email || "—",
        specialization: u.specialization || "—",
        email_verified: u.email_verified || "—",
      }));
      setPendingRequests(formatted);
    } else {
      setPendingRequests([]);
    }
  }, [pendingData]);

  // Format approved data
  useEffect(() => {
    if (approvedData?.approvedEmployeer && Array.isArray(approvedData.approvedEmployeer)) {
      const formatted = approvedData.approvedEmployeer.map((u) => ({
        id: u.id,
        full_name: u.full_name || `${u.first_name} ${u.last_name}` || "—",
        phone: u.phone || "—",
        email: u.email || "—",
        specialization: u.specialization || "—",
        email_verified: u.email_verified || "—",
      }));
      setApprovedRequests(formatted);
    } else {
      setApprovedRequests([]);
    }
  }, [approvedData]);

  // Format rejected data
  useEffect(() => {
    if (rejectedData?.rejectedEmployeer && Array.isArray(rejectedData.rejectedEmployeer)) {
      const formatted = rejectedData.rejectedEmployeer.map((u) => ({
        id: u.id,
        full_name: u.full_name || `${u.first_name} ${u.last_name}` || "—",
        phone: u.phone || "—",
        email: u.email || "—",
        specialization: u.specialization || "—",
        email_verified: u.email_verified || "—",
      }));
      setRejectedRequests(formatted);
    } else {
      setRejectedRequests([]);
    }
  }, [rejectedData]);

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

  // Handle accept/reject actions after confirmation
  const handleAction = async () => {
    if (!selectedItemId || !modalAction) return;

    const url = modalAction === 'accept'
      ? `${apiUrl}/admin/acceptPendingEmployeer/${selectedItemId}`
      : `${apiUrl}/admin/rejectPendingEmployeer/${selectedItemId}`;

    const success = await changeState(
      url,
      `${modalAction === 'accept' ? 'Accepted' : 'Rejected'} Successfully.`,
      {}
    );

    if (success) {
      setPendingRequests((prev) => prev.filter((item) => item.id !== selectedItemId));
      modalAction === 'accept' ? refetchApproved() : refetchRejected();
    }

    closeConfirmationModal();
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

  // Filter keys for table filtering
  const filterKeys = ["email_verified"];

  // Titles for filter placeholders
  const titles = {
    email_verified: "All Email Statuses",
  };

  return (
    <div className="p-4">
      {loadingPending || loadingApproved || loadingRejected || loadingChange ? (
        <FullPageLoader />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl text-bg-primary font-bold">Employer Request</h2>
          </div>

          <Tabs defaultValue="pending" className="w-full">
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
                titles={titles}
                statusKey="email_verified"
                onEdit={handleEdit}
                renderActionCell={renderActionCell}
                actionsButtons={false} // unEnable action buttons for pending requests
              />
            </TabsContent>

            <TabsContent value="approved">
              <Table
                data={approvedRequests}
                columns={Columns}
                filterKeys={filterKeys}
                titles={titles}
                statusKey="email_verified"
                onEdit={handleEdit}
                actionsButtons={false} // unEnable action buttons for pending requests
              />
            </TabsContent>

            <TabsContent value="rejected">
              <Table
                data={rejectedRequests}
                columns={Columns}
                filterKeys={filterKeys}
                titles={titles}
                statusKey="email_verified"
                onEdit={handleEdit}
                actionsButtons={false} // unEnable action buttons for pending requests
              />
            </TabsContent>
          </Tabs>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>
                  {modalAction === 'accept' ? 'Confirm Accept' : 'Confirm Reject'}
                </DialogTitle>
              </DialogHeader>
              <p>
                Are you sure you want to {modalAction === 'accept' ? 'accept' : 'reject'} this employer?
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
        </>
      )}
    </div>
  );
};

export default Requests;