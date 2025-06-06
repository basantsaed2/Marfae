import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate

const CorporateManagement = () => {
    const navigate = useNavigate(); // Initialize useNavigate

    const users = [
        {
            entityName: " Al-Hayat Specialized  Al-Hayat Specialized Hospital",
            type: "Hospital",
            governorate: "Cairo",
            phone: "01000000000",
            authenticationStatus: "Documented",
            activationStatus: "Activated",
            jobs: "8 jobs"
        },
        {
            entityName: "Laboratory",
            type: "Plant",
            governorate: "Alex",
            phone: "01230000000",
            authenticationStatus: "Documented",
            activationStatus: "Activated",
            jobs: "2 jobs"
        },
        {
            entityName: "Internal Medicine Specialist",
            type: "Medical Center Hospital",
            governorate: "Cairo",
            phone: "01660000000",
            authenticationStatus: "Undocumented",
            activationStatus: "Suspended",
            jobs: "0 jobs"
        },
    ];

    const columns = [
        { key: "entityName", label: "Name of the entity" },
        { key: "type", label: "Type" },
        { key: "governorate", label: "Governorate" },
        { key: "phone", label: "Contact Number" },
        { key: "authenticationStatus", label: "Authentication Status" },
        { key: "activationStatus", label: "Activation Status" },
        { key: "jobs", label: "Status" },
    ];

    const handleView = (user) => console.log("View:", user);

    const handleEdit = (user) => {
        // Navigate to the AddJob page with the job data in the state
        navigate('add', { state: { corporateData: user } });
    };

    const handleDelete = (user) => console.log("Delete:", user);

    return (
        <div className='p-4'>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl text-bg-primary font-bold">Corporate Management</h1>
                <Link to="add" className="flex justify-center items-center px-4 py-1 rounded-md text-base bg-bg-secondary font-semibold text-white hover:bg-bg-secondary/90">
                    <Plus className="mr-2 h-4 w-4 text-white" /> Add A Medical Entity
                </Link>
            </div>
            <Table
                data={users}
                columns={columns}
                filterKeys={["type", "activationStatus", "governorate"]}
                statusKey="activationStatus"
                titles={{ type: "Type of entity", activationStatus: "Activation Status", governorate: "Governorate" }}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                className="w-full bg-white rounded-lg shadow-md p-6"
            />
        </div>
    );
};

export default CorporateManagement;