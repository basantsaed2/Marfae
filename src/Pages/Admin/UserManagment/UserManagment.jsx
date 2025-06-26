import React, { useState, useEffect } from "react";
import { Table } from '@/components/ui/table';
import { Link, useNavigate } from 'react-router-dom';
import { useGet } from '@/Hooks/UseGet';
import DeleteDialog from '@/components/DeleteDialog'; // Import DeleteDialog
import FullPageLoader from "@/components/Loading";
import { useChangeState } from "@/Hooks/useChangeState";
import { Plus } from 'lucide-react';

const UserManagment = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { refetch: refetchUser, loading: loadingUser, data: dataUser } = useGet({ url: `${apiUrl}/admin/getUsers` });
  const { loadingChange, changeState } = useChangeState();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    refetchUser();
  }, [refetchUser]);

  useEffect(() => {
    if (dataUser && dataUser.users) {
      const formatted = dataUser?.users?.map((u) => ({
        id: u.id,
        name: u.first_name + u.last_name || "—",
        first_name: u.first_name || "—",
        last_name: u.last_name || "—",
        img: u.image_link || '',
        image: u.image || '',
        phone: u.phone || "—",
        email: u.email || "—",
        specializations: Array.isArray(u.specializations)
          ? u.specializations.map((s) => ({
            id: s?.id,
            name: s?.name || "—",
          }))
          : [], // Store for editing
        specializationsDisplay: Array.isArray(u.specializations)
          ? u.specializations
            .map((s) => s.name || "—")
            .join(", ") || "—"
          : "—", // For display
        status: u.status === "active" ? "Active" : "Inactive",
      }));
      setUsers(formatted);
    }
  }, [dataUser]);

  const Columns = [
    { key: "img", label: "Image" },
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "specializationsDisplay", label: "Specializations" },
    { key: "status", label: "Status" },
  ];

  const handleEdit = (item) => navigate(`add`, { state: { itemData: item } });

  const handleDelete = (item) => {
    setSelectedRow(item);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRow) return;

    const success = await changeState(
      `${apiUrl}/admin/deleteUser/${selectedRow.id}`, // URL for the PUT request
      `${selectedRow.name} Deleted Successfully.`, // Success message
      {} // Data payload (empty object if no additional data is needed)
    );

    if (success) {
      setIsDeleteOpen(false);
      setUsers((prev) => prev.filter((item) => item.id !== selectedRow.id));
      setSelectedRow(null);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-bg-primary font-bold">Users Managment</h2>
        <Link
          to="add"
          className="flex justify-center items-center px-4 py-1 rounded-md text-base bg-bg-secondary font-semibold text-white hover:bg-bg-secondary/90"
        >
          <Plus className="mr-2 h-4 w-4 text-white" /> Add User
        </Link>
      </div>
      {loadingUser ? (
        <FullPageLoader />
      ) : (
        <Table
          data={users}
          columns={Columns}
          statusKey="status"
          filterKeys={["name"]}
          titles={{ name: "User Name" }}
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
        isLoading={loadingChange}
      />
    </div>
  );
};

export default UserManagment;