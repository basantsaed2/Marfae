import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Add from '@/components/AddFieldSection';
import { ArrowLeft } from 'lucide-react';
import { usePost } from '@/Hooks/UsePost';
import { useChangeState } from '@/Hooks/useChangeState';
import { useGet } from '@/Hooks/UseGet';

const AddUser = ({ lang = 'en' }) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { postData, loadingPost, response: postResponse } = usePost({ url: `${apiUrl}/admin/addUser` });
    const { changeState, loadingChange, responseChange } = useChangeState();
    const { refetch: refetchSpecialization, loading: loadingSpecialization, data: dataSpecialization } = useGet({ url: `${apiUrl}/admin/getSpecializations` });

    const [specializations, setSpecializations] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const initialItemData = state?.itemData || null;

    // Determine if we're in "edit" mode based on whether itemData is provided
    const isEditMode = !!initialItemData;
    const title = isEditMode ? 'Edit User' : 'Add User';

    useEffect(() => {
        refetchSpecialization();
    }, [refetchSpecialization]);

    useEffect(() => {
        if (dataSpecialization && dataSpecialization.specializations) {
            const formatted = dataSpecialization?.specializations?.map((u) => ({
                label: u.name || "—",
                value: u.id.toString() || "", // Ensure ID is a string
            }));
            setSpecializations(formatted);
        }
    }, [dataSpecialization]);

    // Define the fields for the form based on provided JSON structure
    const fields = [
        { name: 'first_name', type: 'input', placeholder: 'First Name' },
        { name: 'last_name', type: 'input', placeholder: 'Last Name' },
        { name: 'phone', type: 'input', placeholder: 'Phone' },
        { name: 'email', type: 'input', placeholder: 'Email' },
        { name: 'password', type: 'input', placeholder: 'Password', disabled: isEditMode }, // Disable password in edit mode
        {
            name: 'specialization',
            type: 'select',
            placeholder: 'Choose the specialization',
            options: specializations,
        },
        { type: 'file', placeholder: 'Image', name: 'image', accept: 'image/*' },
        {
            type: 'switch',
            name: 'status',
            placeholder: 'Status',
            returnType: 'string',
            activeLabel: 'Active',
            inactiveLabel: 'Inactive',
        },
    ];

    // State to manage form values
    const [values, setValues] = useState({});

    // Set initial values when itemData is provided
    useEffect(() => {
        if (initialItemData) {
            setValues({
                id: initialItemData.id || '',
                first_name: initialItemData.first_name || '',
                last_name: initialItemData.last_name || '',
                phone: initialItemData.phone || '',
                email: initialItemData.email || '',
                specialization: initialItemData.specialization || '',
                status: initialItemData.status === 'Active' ? 'active' : 'inactive',
                image: initialItemData.image || '', // Image URL or file name
            });
        }
    }, [initialItemData]);

    const handleChange = (lang, name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (isEditMode) {
            // Edit mode: Use changeState (PUT request)
            const data = {
                id: values.id,
                first_name: values.first_name || '',
                last_name: values.last_name || '',
                phone: values.phone || '',
                email: values.email || '',
                specialization: values.specialization || '',
                status: values.status || 'inactive',
            };
            await changeState(
                `${apiUrl}/admin/editUser/${values.id}`,
                'User Updated Successfully!',
                data
            );
        } else {
            // Add mode: Use postData (POST request)
            const body = new FormData();
            body.append('first_name', values.first_name || '');
            body.append('last_name', values.last_name || '');
            body.append('phone', values.phone || '');
            body.append('email', values.email || '');
            body.append('password', values.password || '');
            body.append('specialization', values.specialization || '');
            body.append('status', values.status || 'inactive');
            if (values.image && typeof values.image !== 'string') {
                body.append('image', values.image);
            }

            await postData(body, 'User Added Successfully!');
        }
    };

    useEffect(() => {
        if ((!loadingChange && responseChange) || (!loadingPost && postResponse)) {
            navigate(-1);
        }
    }, [responseChange, postResponse, navigate]);

    const handleReset = () => {
        setValues(initialItemData ? {
            id: initialItemData.id || '',
            first_name: initialItemData.first_name || '',
            last_name: initialItemData.last_name || '',
            phone: initialItemData.phone || '',
            email: initialItemData.email || '',
            specialization: initialItemData.specialization || '',
            status: initialItemData.status === 'Active' ? 'active' : 'inactive',
            image: initialItemData.image || '',
        } : {});
    };

    const handleBack = () => {
        navigate(-1); // Navigate to the previous page
    };

    return (
        <div className="p-4">
            <div className="flex items-center mb-4">
                <button
                    type="button"
                    onClick={handleBack}
                    className="p-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 mr-3"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h2 className="text-2xl text-bg-primary font-bold">{title}</h2>
            </div>

            <div className="py-10 px-4 bg-white rounded-lg shadow-md">
                <Add
                    fields={fields}
                    lang={lang}
                    values={values}
                    onChange={handleChange}
                />
            </div>

            <div className="mt-6 flex justify-end gap-4">
                {isEditMode && (
                    <button
                        type="button"
                        onClick={() => setIsDeleteOpen(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        disabled={loadingPost || loadingChange}
                    >
                        Delete
                    </button>
                )}
                <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                    disabled={loadingPost || loadingChange}
                >
                    Reset
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-bg-secondary text-white rounded-md hover:bg-bg-secondary/90"
                    disabled={loadingPost || loadingChange}
                >
                    {loadingPost || loadingChange ? 'Submitting...' : isEditMode ? 'Update' : 'Submit'}
                </button>
            </div>

        </div>
    );
};

export default AddUser;