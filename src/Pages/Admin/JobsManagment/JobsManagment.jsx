import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate

const JobsManagement = () => {
    const navigate = useNavigate(); // Initialize useNavigate

    const users = [
        {
            jobTitle: "Internal Medicine Specialist",
            companyName: "Medical Center Hospital",
            site: "Cairo",
            productionDate: "2025-01-13",
            status: "Activated",
        },
        {
            jobTitle: "Emergency Department Nurse",
            companyName: "Al Salam Hospital",
            site: "Alexandria",
            productionDate: "2025-01-13",
            status: "Suspended",
        },
        {
            jobTitle: "Laboratory Specialist",
            companyName: "Al-Shifa Laboratories",
            site: "Suez",
            productionDate: "2025-01-13",
            status: "Waiting for activation",
        },
    ];

    const columns = [
        { key: "jobTitle", label: "Job Title" },
        { key: "companyName", label: "Company Name" },
        { key: "site", label: "The Site" },
        { key: "productionDate", label: "Production Date" },
        { key: "status", label: "Status" },
    ];

    const handleView = (user) => console.log("View:", user);

    const handleEdit = (user) => {
        // Navigate to the AddJob page with the job data in the state
        navigate('add', { state: { jobData: user } });
    };

    const handleDelete = (user) => console.log("Delete:", user);

    return (
        <div className='p-4'>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl text-bg-primary font-bold">Job Management</h1>
                <Link to="add" className="flex justify-center items-center px-4 py-1 rounded-md text-base bg-bg-secondary font-semibold text-white hover:bg-bg-secondary/90">
                    <Plus className="mr-2 h-4 w-4 text-white" /> Add New Job
                </Link>
            </div>
            <Table
                data={users}
                columns={columns}
                filterKeys={["companyName", "site", "jobTitle"]}
                statusKey="status"
                titles={{ companyName: "Company Name", site: "Site", jobTitle: "Job Title" }}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                className="w-full bg-white rounded-lg shadow-md p-6"
            />
        </div>
    );
};

export default JobsManagement;