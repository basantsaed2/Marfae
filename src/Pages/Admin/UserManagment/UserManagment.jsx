import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const UserManagement = () => {
  const users = [
    {
      fullName: "Ahmed Mohammed Ali",
      email: "ahmed.moh@gmail.com",
      specialization: "Ophthalmologist",
      status: "Activated",
      registrationDate: "2025-01-15",
    },
    {
      fullName: "Sarah Ahmed Hussein",
      email: "sarah@medicorp.com",
      specialization: "Psychologist",
      status: "Suspended",
      registrationDate: "2025-01-14",
    },
    {
      fullName: "Omar Ahmed Nour El-Din",
      email: "info@futuredmed.com",
      specialization: "Surgeon",
      status: "Waiting for activation",
      registrationDate: "2025-01-13",
    },
  ];

  const columns = [
    { key: "fullName", label: "Full name" },
    { key: "email", label: "E-mail" },
    { key: "specialization", label: "User Specialization" },
    { key: "status", label: "Status" },
    { key: "registrationDate", label: "Registration date" },
  ];

  const handleView = (user) => console.log("View:", user);
  const handleEdit = (user) => console.log("Edit:", user);
  const handleDelete = (user) => console.log("Delete:", user);

  return (
    <div className='p-4'>
      <h1 className="text-2xl text-bg-primary font-bold mb-4 text-right">User Management</h1>
      <Table
        data={users}
        columns={columns}
        filterKeys={["status", "specialization"]}
        statusKey="status"
        titles={{ status: "Status", specialization: "User specialization" }} // Custom titles
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        className="w-full bg-white rounded-lg shadow-md p-6"
      />
    </div>
  );
};

export default UserManagement;