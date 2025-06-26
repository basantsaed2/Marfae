import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGet } from '@/Hooks/UseGet';
import { useDelete } from '@/Hooks/useDelete';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeleteDialog from '@/components/DeleteDialog'; // Import DeleteDialog
import FullPageLoader from "@/components/Loading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useChangeState } from "@/Hooks/useChangeState";

const PaymentMethod = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { refetch: refetchPaymentMethod, loading: loadingPaymentMethod, data: dataPaymentMethod } = useGet({ url: `${apiUrl}/admin/getPaymentMethods` });
  const { loadingDelete, deleteData } = useDelete();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    refetchPaymentMethod();
  }, [refetchPaymentMethod]);

 useEffect(() => {
  if (dataPaymentMethod && dataPaymentMethod.paymentMethods) {
    const formatted = dataPaymentMethod?.paymentMethods?.map((u) => ({
      id: u.id,
      name: u.name || "—",
      img: u.image_link || "—", // Store the image URL or a placeholder string
      image: u.image || "—", // Use the image_l field for the avatar
      phone: u.phone || "—",
      account: u.account || "—",
      status: u.status === "active" ? "Active" : "Inactive",
    }));
    setPaymentMethod(formatted);
  }
}, [dataPaymentMethod]);

  const Columns = [
    { key: "img", label: "Image" },
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "account", label: "Account" },
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
      `${apiUrl}/admin/deletePaymentMethod/${selectedRow.id}`, // URL for the PUT request
      `${selectedRow.name} Deleted Successfully.`, // Success message
      {} // Data payload (empty object if no additional data is needed)
    );

    if (success) {
      setIsDeleteOpen(false);
      setPaymentMethod((prev) => prev.filter((item) => item.id !== selectedRow.id));
      setSelectedRow(null);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-bg-primary font-bold">Payment Methods</h2>
        <Link
          to="add"
          className="flex justify-center items-center px-4 py-1 rounded-md text-base bg-bg-secondary font-semibold text-white hover:bg-bg-secondary/90"
        >
          <Plus className="mr-2 h-4 w-4 text-white" /> Add Payment Method
        </Link>
      </div>
      {loadingPaymentMethod ? (
        <FullPageLoader />
      ) : (
        <Table
          data={paymentMethod}
          columns={Columns}
          statusKey="status"
          filterKeys={["name"]}
          titles={{ name: "Payment Method" }}
          onEdit={(item) => handleEdit({ ...item, type: 'name' })}
          onDelete={handleDelete}
          className="w-full bg-white rounded-lg shadow-md p-6"
        />
      )}
      <DeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onDelete={handleDeleteConfirm}
        name={selectedRow?.name}
        isLoading={loadingDelete}
      />
    </div>
  );
};

export default PaymentMethod;