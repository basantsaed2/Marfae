import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGet } from '@/Hooks/UseGet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FullPageLoader from "@/components/Loading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useChangeState } from "@/Hooks/useChangeState";

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

  // Common columns for all tables
  const Columns = [
    { key: "full_name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "specialization", label: "Specialization" },
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
    if (approvedData?.pendingEmployeer && Array.isArray(approvedData.pendingEmployeer)) {
      const formatted = approvedData.pendingEmployeer.map((u) => ({
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
    if (rejectedData?.pendingEmployeer && Array.isArray(rejectedData.pendingEmployeer)) {
      const formatted = rejectedData.pendingEmployeer.map((u) => ({
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

  // Handle accept/reject actions
  const handleAction = async (id, action) => {
    const url = action === 'accept' 
      ? `${apiUrl}/admin/acceptPendingEmployeer/${id}`
      : `${apiUrl}/admin/rejectPendingEmployeer/${id}`;
    
    const success = await changeState(
      url,
      `${action === 'accept' ? 'Accepted' : 'Rejected'} Successfully.`,
      {}
    );

    if (success) {
      setPendingRequests((prev) => prev.filter((item) => item.id !== id));
      action === 'accept' ? refetchApproved() : refetchRejected();
    }
  };

  const handleEdit = (item) => navigate(`add`, { state: { itemData: item } });

  // Render action buttons for pending table
  const renderActionCell = (item) => (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleAction(item.id, 'accept')}
        className="bg-green-500 text-white hover:bg-green-600"
      >
        Accept
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleAction(item.id, 'reject')}
        className="bg-red-500 text-white hover:bg-red-600"
      >
        Reject
      </Button>
    </div>
  );

  return (
    <div className="p-4">
      
    </div>
  );
};

export default Requests;