import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Add from '@/components/AddFieldSection';
import { ArrowLeft } from 'lucide-react';
import { usePost } from '@/Hooks/UsePost';
import { useChangeState } from '@/Hooks/useChangeState';
import { useGet } from '@/Hooks/UseGet';
import FullPageLoader from '@/components/Loading';

const AddUser = ({ lang = 'en' }) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { postData, loadingPost, response: postResponse } = usePost({ url: `${apiUrl}/admin/addUser` });
    const { changeState, loadingChange, responseChange } = useChangeState();
    const { refetch: refetchSpecialization, loading: loadingSpecialization, data: dataSpecialization } = useGet({ url: `${apiUrl}/admin/getSpecializations` });

    const [specializations, setSpecializations] = useState([]);
    const [imageChanged, setImageChanged] = useState(false); // Track if image has been changed

    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const initialItemData = state?.itemData || null;

    const isEditMode = !!initialItemData;
    const title = isEditMode ? 'Edit User' : 'Add User';

    useEffect(() => {
        refetchSpecialization();
    }, [refetchSpecialization]);

    useEffect(() => {
        if (dataSpecialization && dataSpecialization.specializations) {
            const formatted = dataSpecialization.specializations.map((u) => ({
                label: u.name || "—",
                value: u.id.toString() || "",
            }));
            setSpecializations(formatted);
        }
    }, [dataSpecialization]);

    const fields = [
        { name: 'first_name', type: 'input', placeholder: 'First Name' },
        { name: 'last_name', type: 'input', placeholder: 'Last Name' },
        { name: 'phone', type: 'input', placeholder: 'Phone' },
        { name: 'email', type: 'input', placeholder: 'Email' },
        { name: 'password', type: 'input', placeholder: 'Password', disabled: isEditMode },
        {
            name: 'specializations',
            type: 'multi-select',
            placeholder: ',Choose specializations',
            options: specializations,
            multiple: true,
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

    const [values, setValues] = useState({});

    useEffect(() => {
        if (initialItemData) {
            setValues({
                id: initialItemData.id || '',
                first_name: initialItemData.first_name || '',
                last_name: initialItemData.last_name || '',
                phone: initialItemData.phone || '',
                email: initialItemData.email || '',
                specializations: Array.isArray(initialItemData.specializations)
                    ? initialItemData.specializations
                        .filter((s) => s && s.id != null)
                        .map((s) => s.id.toString())
                    : [],
                status: initialItemData.status === 'Active' ? 'active' : 'inactive',
                image: initialItemData.image || '', // Existing image URL or empty
            });
        }
    }, [initialItemData]);

    const handleChange = (lang, name, value) => {
        if (name === 'image') {
            setImageChanged(true); // Mark image as changed when file input is used
        }
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if ((!loadingChange && responseChange) || (!loadingPost && postResponse)) {
            navigate(-1);
        }
    }, [responseChange, postResponse, navigate]);

    const handleSubmit = async () => {
        if (isEditMode) {
            // Edit mode: Use changeState (PUT request)
            const data = {
                id: values.id,
                first_name: values.first_name || '',
                last_name: values.last_name || '',
                phone: values.phone || '',
                email: values.email || '',
                specialization: values.specializations.map((id) => parseInt(id)),
                status: values.status || 'inactive',
            };

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
            body.append('password', values.password || '');
            values.specializations.forEach((id) => {
                body.append('specialization[]', parseInt(id));
            });
            body.append('status', values.status || 'inactive');

            // Only append image if it has been changed
            if (imageChanged && values.image) {
                body.append('image', values.image);
            }

            await postData(body, 'User Added Successfully!');
        }
    };

    const handleReset = () => {
        setImageChanged(false); // Reset image change flag
        setValues(
            initialItemData
                ? {
                    id: initialItemData.id || '',
                    first_name: initialItemData.first_name || '',
                    last_name: initialItemData.last_name || '',
                    phone: initialItemData.phone || '',
                    email: initialItemData.email || '',
                    specializations: Array.isArray(initialItemData.specializations)
                        ? initialItemData.specializations
                            .filter((s) => s && s.id != null)
                            .map((s) => s.id.toString())
                        : [],
                    status: initialItemData.status === 'Active' ? 'active' : 'inactive',
                    image: initialItemData.image || '',
                }
                : {}
        );
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (loadingSpecialization) {
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
                <Add fields={fields} lang={lang} values={values} onChange={handleChange} />
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