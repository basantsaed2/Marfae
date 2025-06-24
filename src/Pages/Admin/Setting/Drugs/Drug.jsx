import React, { useState, useEffect } from "react";
import { Table} from '@/components/ui/table';
import { Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGet } from '@/Hooks/UseGet';
import { useDelete } from '@/Hooks/useDelete';
import DeleteDialog from '@/components/DeleteDialog'; // Import DeleteDialog
import FullPageLoader from "@/components/Loading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useChangeState } from "@/Hooks/useChangeState";

const Drug = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { refetch: refetchDrug, loading: loadingDrug, data: dataDrug } = useGet({ url: `${apiUrl}/admin/getDrugs` });
  const { loadingChange, changeState } = useChangeState();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [countries, setCountries] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    refetchDrug();
  }, [refetchDrug]);

  useEffect(() => {
    if (dataDrug && dataDrug.drugs) {
      const formatted = dataDrug?.drugs?.map((u) => ({
        id: u.id,
        name: u.name || "—",
        img: u.image_link ? (
          <img
            src={u.image}
            alt={u.name}
            className="w-12 h-12 object-cover rounded-md"
          />
        ) : (
          <Avatar className="w-12 h-12">
            <AvatarFallback>{u.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        ),
        company: u.company || "—",
        status: u.status === "active" ? "Active" : "Inactive",
      }));
      setCountries(formatted);
    }
  }, [dataDrug]);

  const Columns = [
    // { key: "img", label: "Image" },
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "specialization", label: "Specialization" },
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
      `${apiUrl}/admin/deleteDrug/${selectedRow.id}`, // URL for the PUT request
      `${selectedRow.name} Deleted Successfully.`, // Success message
      {} // Data payload (empty object if no additional data is needed)
    );

    if (success) {
      setIsDeleteOpen(false);
      setCountries((prev) => prev.filter((item) => item.id !== selectedRow.id));
      setSelectedRow(null);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-bg-primary font-bold">Drugs Managment</h2>
        <Link
          to="add"
          className="flex justify-center items-center px-4 py-1 rounded-md text-base bg-bg-secondary font-semibold text-white hover:bg-bg-secondary/90"
        >
          <Plus className="mr-2 h-4 w-4 text-white" /> Add Drug
        </Link>
      </div>
      {loadingDrug ? (
        <FullPageLoader />
      ) : (
        <Table
          data={countries}
          columns={Columns}
          statusKey="status"
          filterKeys={["name"]}
          titles={{ name: "Drug Name" }}
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

export default Drug;