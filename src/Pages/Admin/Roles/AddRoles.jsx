import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Add from '@/components/AddFieldSection';
import { ArrowLeft } from 'lucide-react';
import { usePost } from '@/Hooks/UsePost';
import { useChangeState } from '@/Hooks/useChangeState';
import { useGet } from '@/Hooks/UseGet';
import FullPageLoader from '@/components/Loading';
import { toast } from 'react-toastify';

const AddRoles = ({ lang = 'en' }) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const initialItemData = state?.itemData || null;

    // API endpoints
    const permissionsUrl = `${apiUrl}/admin/permissions`;
    const addRoleUrl = `${apiUrl}/admin/roles`;
    const editRoleUrl = (id) => `${apiUrl}/admin/roles/${id}`;

    // Hooks for data operations
    // Note: PUT request to editRoleUrl(id) needs to be handled by useChangeState 
    const { postData, loadingPost, response: postResponse } = usePost({ url: addRoleUrl, type: true });
    const { changeState, loadingChange, responseChange } = useChangeState({ method: 'PUT' }); // Assuming useChangeState handles method override
    const { refetch: refetchPermissions, loading: loadingPermissions, data: dataPermissions } = useGet({ url: permissionsUrl });

    const [permissionsList, setPermissionsList] = useState([]);

    // Initial state for role values
    const [values, setValues] = useState({
        name: '',
        permissions: [] // Array of permission IDs (as strings initially)
    });

    const isEditMode = !!initialItemData;
    const title = isEditMode ? 'Edit Role' : 'Add Role';

    // 1. Fetch available permissions on mount
    useEffect(() => {
        refetchPermissions();
    }, [refetchPermissions]);

    // 2. Format and set available permissions (API returns array of {id, name, ...})
    useEffect(() => {
        if (dataPermissions && dataPermissions.permissions && Array.isArray(dataPermissions.permissions) && !loadingPermissions) {
            const formatted = dataPermissions.permissions.map((p) => ({
                label: p.name || p.id.toString(),
                value: p.id.toString() || "",
            }));
            setPermissionsList(formatted);
        }
    }, [dataPermissions]);

    // 3. Populate form in edit mode once permissions are loaded
    useEffect(() => {
        if (isEditMode && initialItemData) {

            // Map the array of permission objects to an array of string IDs for the multi-select component
            const initialPermissions = Array.isArray(initialItemData.permissions)
                ? initialItemData.permissions.map(p => p.id?.toString() || p.toString())
                : [];

            setValues({
                id: initialItemData.id || '',
                name: initialItemData.name || '',
                permissions: initialPermissions,
            });
        }
    }, [initialItemData]); // Note: Removed permissionsList dependency for initial load robustness

    // Fields configuration
    const roleFields = [
        { name: 'name', type: 'input', placeholder: 'Role Name *' },
        {
            name: 'permissions',
            type: 'multi-select',
            placeholder: 'Select Permissions *',
            options: permissionsList,
            multiple: true,
            loading: loadingPermissions
        },
    ];

    const handleChange = (lang, name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    // 4. Handle navigation after successful post/change
    useEffect(() => {
        if ((!loadingChange && responseChange?.status === 200) || (!loadingPost && postResponse?.status === 200)) {
            navigate(-1);
        }
    }, [responseChange, postResponse, navigate, loadingChange, loadingPost]);

    const handleSubmit = async () => {
        // Validate required fields
        if (
            !values.name ||
            !values.permissions ||
            values.permissions.length === 0
        ) {
            toast.error('Please fill in all required fields (Role Name and Permissions)');
            return;
        }

        // Convert permission IDs from string[] (from multi-select) to number[] for the API payload
        const permissionIds = values.permissions.map(id => parseInt(id, 10));

        const data = {
            name: values.name,
            permissions: permissionIds,
        };

        if (isEditMode) {
            // Edit mode: Use changeState (PUT request)
            await changeState(
                editRoleUrl(values.id),
                'Role Updated Successfully!',
                data
            );
        } else {
            // Add mode: Use postData (POST request)
            await postData(data, 'Role Added Successfully!');
        }
    };

    const handleReset = () => {
        if (isEditMode && initialItemData) {
            const resetPermissions = Array.isArray(initialItemData.permissions)
                ? initialItemData.permissions.map(p => p.id?.toString() || p.toString())
                : [];

            setValues({
                id: initialItemData.id || '',
                name: initialItemData.name || '',
                permissions: resetPermissions,
            });
        } else {
            setValues({
                name: '',
                permissions: []
            });
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (loadingPermissions) {
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
                <Add
                    fields={roleFields}
                    lang={lang}
                    values={values}
                    onChange={handleChange}
                />
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

export default AddRoles;