import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Add from '@/components/AddFieldSection';
import { ArrowLeft } from 'lucide-react';
import { usePost } from '@/Hooks/UsePost';
import { useChangeState } from '@/Hooks/useChangeState';
import { useGet } from '@/Hooks/UseGet';
import FullPageLoader from '@/components/Loading';
import { toast } from 'react-toastify';

const AddAdminUsers = ({ lang = 'en' }) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    // Hooks for requests
    const { postData, loadingPost, response: postResponse } = usePost({ url: `${apiUrl}/admin/create-admin` });
    const { changeState, loadingChange, responseChange } = useChangeState();

    // Fetch Roles to populate dropdown
    const { refetch: refetchRoles, loading: loadingRoles, data: dataRoles } = useGet({ url: `${apiUrl}/admin/roles` });

    const [rolesOptions, setRolesOptions] = useState([]);
    const [values, setValues] = useState({});

    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const initialItemData = state?.itemData || null;

    const isEditMode = !!initialItemData;
    const title = isEditMode ? 'Edit Admin Roles' : 'Add New Admin';

    // 1. Fetch available roles
    useEffect(() => {
        refetchRoles();
    }, [refetchRoles]);

    // 2. Format roles for dropdown
    useEffect(() => {
        const rolesArray = dataRoles?.roles || dataRoles;
        if (rolesArray && Array.isArray(rolesArray)) {
            const formatted = rolesArray.map(r => ({
                label: r.name || r.id,
                value: r.id.toString()
            }));
            setRolesOptions(formatted);
        }
    }, [dataRoles]);

    // 3. Initialize values — ONLY ROLES in edit mode
    useEffect(() => {
        if (!initialItemData || !dataRoles) return;

        const rolesArray = dataRoles?.roles || dataRoles || [];

        // Map role name → id
        const roleNameToId = {};
        rolesArray.forEach(r => {
            const name = (r.name || '').trim();
            if (name) {
                roleNameToId[name] = r.id.toString();
            }
        });

        const rawAdmin = initialItemData.raw || initialItemData;

        const currentRoleNames = Array.isArray(rawAdmin.role_names)
            ? rawAdmin.role_names.map(n => (n || '').trim())
            : [];

        const selectedRoleIds = currentRoleNames
            .map(name => roleNameToId[name])
            .filter(Boolean);

        setValues({
            id: initialItemData.id || rawAdmin.id,
            // Only role is needed in edit mode
            role: selectedRoleIds.length > 0 ? selectedRoleIds : []
        });
    }, [initialItemData, dataRoles]);

    // 4. Define Form Fields — Show only roles in edit mode
    const getFields = () => {
        if (isEditMode) {
            // In edit mode: ONLY show roles
            return [
                {
                    name: 'role',
                    type: 'multi-select',
                    placeholder: 'Select Roles *',
                    options: rolesOptions,
                    multiple: true,
                },
            ];
        }

        // In create mode: full form
        return [
            {
                name: 'first_name',
                type: 'input',
                placeholder: 'First Name *',
            },
            {
                name: 'last_name',
                type: 'input',
                placeholder: 'Last Name',
            },
            {
                name: 'phone',
                type: 'input',
                placeholder: 'Phone *',
            },
            {
                name: 'email',
                type: 'input',
                placeholder: 'Email *',
            },
            {
                name: 'password',
                type: 'input',
                placeholder: 'Password *',
                // You can change to type: 'password' if your Add component supports it
            },
            {
                name: 'role',
                type: 'multi-select',
                placeholder: 'Select Roles *',
                options: rolesOptions,
                multiple: true,
            },
        ];
    };

    const handleChange = (lang, name, value) => {
        setValues(prev => ({ ...prev, [name]: value }));
    };

    // 5. Handle navigation on success
    useEffect(() => {
        if ((!loadingChange && responseChange) || (!loadingPost && postResponse && postResponse.status === 200)) {
            navigate(-1);
        }
    }, [responseChange, postResponse, navigate, loadingChange, loadingPost]);

    // 6. Submit Logic
    const handleSubmit = async () => {
        if (isEditMode) {
            if (!values.role || values.role.length === 0) {
                toast.error('Please select at least one role');
                return;
            }

            const payload = {
                roles: values.role.map(id => parseInt(id))
            };

            await changeState(
                `${apiUrl}/admin/update-admin-roles/${values.id}`,
                'Admin Roles Updated Successfully!',
                payload
            );
        } else {
            // Create mode validation
            if (!values.first_name || !values.email || !values.phone || !values.password || !values.role || values.role.length === 0) {
                toast.error('Please fill in all required fields');
                return;
            }

            const payload = {
                first_name: values.first_name.trim(),
                last_name: values.last_name?.trim() || null,
                email: values.email.trim(),
                phone: values.phone.trim(),
                password: values.password,
                role: values.role.map(id => parseInt(id))
            };

            await postData(payload, 'Admin Added Successfully!');
        }
    };

    const handleBack = () => navigate(-1);

    if (loadingRoles) return <FullPageLoader />;

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
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-bg-secondary text-white rounded-md hover:bg-bg-secondary/90"
                    disabled={loadingPost || loadingChange}
                >
                    {loadingPost || loadingChange
                        ? 'Submitting...'
                        : isEditMode
                            ? 'Update Roles'
                            : 'Create Admin'
                    }
                </button>
            </div>
        </div>
    );
};

export default AddAdminUsers;