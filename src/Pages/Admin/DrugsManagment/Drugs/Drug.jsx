import React, { useState, useEffect } from "react";
import { Table } from '@/components/ui/table';
import { Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGet } from '@/Hooks/UseGet';
import DeleteDialog from '@/components/DeleteDialog';
import FullPageLoader from "@/components/Loading";
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
      const formatted = dataDrug.drugs.map((u) => ({
        id: u.id || "—",
        img: u.image_link || "—",
        name: u.name || "—",
        description: u.description || "—",
        price: u.price || '0',
        company: u.company?.name || "—",
        drug_category: u.drug_category?.name || "—",
        drug_category_id: u.drug_category_id?.toString() || "—", // Add drug_category_id
        company_id: u.company_id?.toString() || "—", // Add company_id
      }));
      setCountries(formatted);
    }
  }, [dataDrug]);

  const Columns = [
    { key: "img", label: "Drug Image", },
    { key: "name", label: "Drug Name" },
    { key: "price", label: "Price" },
    { key: "company", label: "Organization" },
    { key: "drug_category", label: "Drug Category" },
    { key: "description", label: "Description" },
  ];

  const handleEdit = (item) => navigate(`add`, { state: { itemData: item } });

  const handleDelete = (item) => {
    setSelectedRow(item);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRow) return;

    const success = await changeState(
      `${apiUrl}/admin/deleteDrug/${selectedRow.id}`,
      `${selectedRow.name} Deleted Successfully.`,
      {}
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
        <h2 className="text-2xl text-bg-primary font-bold">Drugs</h2>
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
          // filterKeys={["name"]}
          // titles={{ name: "Drug Name" }}
          onEdit={(item) => handleEdit({ ...item })}
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