import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Add from '@/components/AddFieldSection';
import { ArrowLeft } from 'lucide-react';
import { usePost } from '@/Hooks/UsePost';
import { useChangeState } from '@/Hooks/useChangeState';
import { useGet } from '@/Hooks/UseGet';
import FullPageLoader from '@/components/Loading';
import { toast } from 'react-toastify';

const AddUser = ({ lang = 'en' }) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { postData, loadingPost, response: postResponse } = usePost({ url: `${apiUrl}/admin/addUser` });
    const { changeState, loadingChange, responseChange } = useChangeState();
    const { refetch: refetchSpecialization, loading: loadingSpecialization, data: dataSpecialization } = useGet({ url: `${apiUrl}/admin/getSpecializations` });
    const { refetch: refetchCompanies, loading: loadingCompanies, data: dataCompanies } = useGet({ url: `${apiUrl}/admin/getCompanies` });

    const [specializations, setSpecializations] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [imageChanged, setImageChanged] = useState(false);
    const [passwordChanged, setPasswordChanged] = useState(false); // Track password changes
    const [selectedRole, setSelectedRole] = useState('');

    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const initialItemData = state?.itemData || null;

    const isEditMode = !!initialItemData;
    const title = isEditMode ? 'Edit User' : 'Add User';

    useEffect(() => {
        refetchSpecialization();
        refetchCompanies();
    }, [refetchSpecialization, refetchCompanies]);

    useEffect(() => {
        if (dataSpecialization && dataSpecialization.specializations) {
            const formatted = dataSpecialization.specializations.map((u) => ({
                label: u.name || "—",
                value: u.id.toString() || "",
            }));
            setSpecializations(formatted);
        }
    }, [dataSpecialization]);

    useEffect(() => {
        if (dataCompanies && dataCompanies.companies) {
            const formatted = dataCompanies.companies.map((u) => ({
                label: u.name || "—",
                value: u.id.toString() || "",
            }));
            setCompanies(formatted);
        }
    }, [dataCompanies]);

    // Base fields that are always shown
    const baseFields = [
        { name: 'first_name', type: 'input', placeholder: 'First Name *' },
        { name: 'last_name', type: 'input', placeholder: 'Last Name' },
        { name: 'phone', type: 'input', placeholder: 'Phone *' },
        { name: 'email', type: 'input', placeholder: 'Email *' },
        { name: 'password', type: 'input', placeholder: 'Password *', disabled: isEditMode },
        {
            name: 'role',
            type: 'select',
            placeholder: 'Select Role *',
            options: [
                { label: 'User', value: 'user' },
                { label: 'Employer', value: 'employeer' },
            ],
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

    // Conditionally add fields based on role
    const getFields = () => {
        const fields = [...baseFields];
        
        // Add company selection for employeers
        if (selectedRole === 'employeer') {
            fields.splice(6, 0, {
                name: 'companies',
                type: 'select',
                placeholder: 'Select Organization *',
                options: companies,
            });
        } 
        // Add specialization selection for users
        else if (selectedRole === 'user') {
            fields.splice(6, 0, {
                name: 'specializations',
                type: 'multi-select',
                placeholder: 'Choose specializations *',
                options: specializations,
                multiple: true,
            });
        }
        
        return fields;
    };

    const [values, setValues] = useState({});

    useEffect(() => {
        if (initialItemData) {
            const initialValues = {
                id: initialItemData.id || '',
                first_name: initialItemData.first_name || '',
                last_name: initialItemData.last_name || '',
                phone: initialItemData.phone || '',
                email: initialItemData.email || '',
                status: initialItemData.status === 'Active' ? 'active' : 'inactive',
                image: initialItemData.image || '',
            };
            
            // Set role and role-specific fields
            if (initialItemData.role) {
                initialValues.role = initialItemData.role;
                setSelectedRole(initialItemData.role);
                
                if (initialItemData.role === 'user') {
                    initialValues.specializations = Array.isArray(initialItemData.specializations)
                        ? initialItemData.specializations
                            .filter((s) => s && s.id != null)
                            .map((s) => s.id.toString())
                        : [];
                } else if (initialItemData.role === 'employeer') {
                    initialValues.companies = initialItemData.company_id 
                        ? initialItemData.company_id.toString() 
                        : '';
                }
            }
            
            setValues(initialValues);
        }
    }, [initialItemData]);

    const handleChange = (lang, name, value) => {
        if (name === 'image') {
            setImageChanged(true);
        }
        
        // Track password changes in edit mode
        if (name === 'password' && isEditMode) {
            setPasswordChanged(true);
        }
        
        if (name === 'role') {
            setSelectedRole(value);
            
            // Clear role-specific fields when role changes
            if (value === 'user') {
                setValues(prev => {
                    const newValues = {...prev, [name]: value};
                    delete newValues.companies;
                    return newValues;
                });
            } else if (value === 'employeer') {
                setValues(prev => {
                    const newValues = {...prev, [name]: value};
                    delete newValues.specializations;
                    return newValues;
                });
            } else {
                setValues(prev => ({...prev, [name]: value}));
            }
        } else {
            setValues((prev) => ({ ...prev, [name]: value }));
        }
    };

    useEffect(() => {
        if ((!loadingChange && responseChange) || (!loadingPost && postResponse)) {
            navigate(-1);
        }
    }, [responseChange, postResponse, navigate]);

    const handleSubmit = async () => {
        // Validate required fields
        if (
            !values.first_name ||
            !values.phone ||
            !values.email ||
            !values.role
        ) {
            toast.error('Please fill in all required fields');
            return;
        }
        
        // For new users, password is required
        if (!isEditMode && !values.password) {
            toast.error('Password is required for new users');
            return;
        }
        
        // Role-specific validation
        if (values.role === 'user' && (!values.specializations || values.specializations.length === 0)) {
            toast.error('Please select at least one specialization');
            return;
        }
        
        if (values.role === 'employeer' && !values.companies) {
            toast.error('Please select a Organization');
            return;
        }

        if (isEditMode) {
            // Edit mode: Use changeState (PUT request)
            const data = {
                id: values.id,
                first_name: values.first_name || '',
                last_name: values.last_name || '',
                phone: values.phone || '',
                email: values.email || '',
                status: values.status || 'inactive',
            };

            // Only include password if it has been changed
            if (passwordChanged && values.password) {
                data.password = values.password;
            }

            // Add role-specific data
            if (values.role === 'user') {
                data.specialization = values.specializations.map((id) => parseInt(id));
            } else if (values.role === 'employeer') {
                data.company_id = parseInt(values.companies);
            }

            // Only include image if it has been changed
            if (imageChanged && values.image) {
                data.image = values.image;
            }

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
            body.append('password', values.password || ''); // Always include password for new users
            body.append('role', values.role || '');
            body.append('status', values.status || 'inactive');

            // Add role-specific data
            if (values.role === 'user' && values.specializations) {
                values.specializations.forEach((id) => {
                    body.append('specialization[]', parseInt(id));
                });
            } else if (values.role === 'employeer' && values.companies) {
                body.append('company_id', parseInt(values.companies));
            }

            // Only append image if it has been changed
            if (imageChanged && values.image) {
                body.append('image', values.image);
            }

            await postData(body, 'User Added Successfully!');
        }
    };

    const handleReset = () => {
        setImageChanged(false);
        setPasswordChanged(false); // Reset password change tracker
        if (initialItemData) {
            const resetValues = {
                id: initialItemData.id || '',
                first_name: initialItemData.first_name || '',
                last_name: initialItemData.last_name || '',
                phone: initialItemData.phone || '',
                email: initialItemData.email || '',
                status: initialItemData.status === 'Active' ? 'active' : 'inactive',
                image: initialItemData.image || '',
            };
            
            if (initialItemData.role) {
                resetValues.role = initialItemData.role;
                setSelectedRole(initialItemData.role);
                
                if (initialItemData.role === 'user') {
                    resetValues.specializations = Array.isArray(initialItemData.specializations)
                        ? initialItemData.specializations
                            .filter((s) => s && s.id != null)
                            .map((s) => s.id.toString())
                        : [];
                } else if (initialItemData.role === 'employeer') {
                    resetValues.companies = initialItemData.company_id 
                        ? initialItemData.company_id.toString() 
                        : '';
                }
            }
            
            setValues(resetValues);
        } else {
            setSelectedRole('');
            setValues({});
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (loadingSpecialization || loadingCompanies) {
        return <FullPageLoader />;
    }

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
                <Add fields={getFields()} lang={lang} values={values} onChange={handleChange} />
            </div>

            <div className="mt-6 flex justify-end gap-4">
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