import React, { useState, useEffect } from "react";
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useGet } from '@/Hooks/UseGet';
import DeleteDialog from '@/components/DeleteDialog';
import FullPageLoader from "@/components/Loading";
import { useChangeState } from "@/Hooks/useChangeState";
import { Plus, Mail, Phone, User, Calendar, MapPin, Briefcase, Award, Circle, Building, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const UserManagment = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { refetch: refetchUser, loading: loadingUser, data: dataUser } = useGet({ url: `${apiUrl}/admin/getUsers` });
  const { loadingChange, changeState } = useChangeState();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
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
        name: u.first_name + " " + u.last_name || "—",
        first_name: u.first_name || "—",
        last_name: u.last_name || "—",
        img: u.image_link || '',
        image: u.image || '',
        phone: u.phone || "—",
        email: u.email || "—",
        age: u.age || "—",
        experience: u.experience || "—",
        role: u.role || "—",
        email_verified: u.email_verified || "—",
        company_id: u.company_id || null,
        company: u.company?.name,
        specializations: Array.isArray(u.specializations)
          ? u.specializations.map((s) => ({
            id: s?.id,
            name: s?.name || "—",
            status: s?.status || "—"
          }))
          : [],
        specializationsDisplay: Array.isArray(u.specializations)
          ? u.specializations
            .map((s) => s.name || "—")
            .join(", ") || "—"
          : "—",
        status: u.status === "active" ? "Active" : u.status === "approved" ? "Approved" : "Inactive",
      }));
      setUsers(formatted);
    }
  }, [dataUser]);

  // Custom renderer for role column - split roles and display each on separate line
  const renderRoleCell = (item) => {
    // Split the role string by comma and trim each role
    const roles = typeof item.role === 'string'
      ? item.role.split(',').map(role => role.trim()).filter(role => role)
      : [];

    return (
      <div className="flex flex-col gap-1 min-w-[100px]">
        {roles.map((role, index) => {
          let icon, bgColor, textColor, displayText;

          switch (role.toLowerCase()) {
            case 'employeer':
              icon = <Building className="h-3 w-3 mr-1" />;
              bgColor = 'bg-blue-100';
              textColor = 'text-blue-800';
              displayText = 'Employer';
              break;
            case 'admin':
              icon = <Award className="h-3 w-3 mr-1" />;
              bgColor = 'bg-purple-100';
              textColor = 'text-purple-800';
              displayText = 'Admin';
              break;
            case 'user':
            default:
              icon = <User className="h-3 w-3 mr-1" />;
              bgColor = 'bg-green-100';
              textColor = 'text-green-800';
              displayText = 'User';
              break;
          }

          return (
            <span
              key={index}
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor} w-fit`}
            >
              {icon}
              {displayText}
            </span>
          );
        })}
      </div>
    );
  };

  const Columns = [
    { key: "img", label: "Image" },
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      renderCell: renderRoleCell // Add custom renderer
    },
    { key: "specializationsDisplay", label: "Specializations" },
    { key: "company", label: "Company" },
    { key: "status", label: "Status" },
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

    const success = await changeState(
      `${apiUrl}/admin/deleteUser/${selectedRow.id}`,
      `${selectedRow.name} Deleted Successfully.`,
      {}
    );

    if (success) {
      setIsDeleteOpen(false);
      setUsers((prev) => prev.filter((item) => item.id !== selectedRow.id));
      setSelectedRow(null);
    }
  };

  const getRoleBadgeColor = (role) => {
    const roleLower = role.toLowerCase();
    switch (roleLower) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'employeer': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Approved': return 'bg-blue-100 text-blue-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl text-bg-primary font-bold">Users Management</h2>
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
          filterKeys={["status"]}
          titles={{ status: "status" }}
          onEdit={(item) => handleEdit({ ...item, type: 'name' })}
          onDelete={handleDelete}
          onView={handleOpenDetails}
          className="w-full bg-white rounded-lg shadow-md p-4 md:p-6"
        />
      )}
      <DeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onDelete={handleDeleteConfirm}
        name={selectedRow?.name}
        isLoading={loadingChange}
      />

      {/* User Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="w-full bg-white rounded-xl shadow-xl p-0 sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                User Details
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mt-1">
                Comprehensive information about the selected user
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
                      alt={`${selectedRow.name} avatar`}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 text-lg font-semibold">
                      {selectedRow.first_name?.charAt(0) || "U"}
                      {selectedRow.last_name?.charAt(0) || ""}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedRow.name}</h2>
                  <p className="text-lg text-gray-700 font-medium mb-2">{selectedRow.email}</p>

                  <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center sm:justify-start gap-2">
                    {/* Display multiple roles in details dialog */}
                    {(() => {
                      const roles = typeof selectedRow.role === 'string'
                        ? selectedRow.role.split(',').map(role => role.trim()).filter(role => role)
                        : [];

                      return roles.map((role, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(role)}`}
                        >
                          <User className="h-3 w-3 mr-1" />
                          {role?.charAt(0).toUpperCase() + role?.slice(1)}
                        </span>
                      ));
                    })()}
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(selectedRow.status)}`}>
                      <Circle className="h-2 w-2 mr-1 fill-current" />
                      {selectedRow.status}
                    </span>
                    {selectedRow.email_verified === "verified" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Verified
                      </span>
                    )}
                  </div>

                </div>
              </div>

              {/* User Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Contact Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email
                        </p>
                        <p className="text-gray-900 font-medium mt-1">{selectedRow.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone
                        </p>
                        <p className="text-gray-900 font-medium mt-1">{selectedRow.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Personal Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">First Name</p>
                        <p className="text-gray-900 font-medium">{selectedRow.first_name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Last Name</p>
                        <p className="text-gray-900 font-medium">{selectedRow.last_name}</p>
                      </div>
                      {selectedRow.age && selectedRow.age !== "—" && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Age</p>
                          <p className="text-gray-900 font-medium">{selectedRow.age}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {selectedRow.experience && selectedRow.experience !== "—" && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Experience
                      </h3>
                      <p className="text-gray-700">{selectedRow.experience}</p>
                    </div>
                  )}

                  {selectedRow.specializations && selectedRow.specializations.length > 0 && (
                    <div className="p-4 bg-indigo-50 rounded-lg">
                      <h3 className="text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Specializations
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedRow.specializations.map((spec, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            {spec.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedRow.company_id && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-2">
                        Company Association
                      </h3>
                      <p className="text-gray-700">Associated with company : {selectedRow.company}</p>
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

export default UserManagment;