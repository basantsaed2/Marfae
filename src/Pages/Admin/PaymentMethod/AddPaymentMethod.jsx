import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Add from '@/components/AddFieldSection';
import { ArrowLeft } from 'lucide-react';
import { usePost } from '@/Hooks/UsePost';
import { useChangeState } from '@/Hooks/useChangeState';

const AddPaymentMethod = ({ lang = 'en' }) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { postData, loadingPost, response: postResponse } = usePost({ url: `${apiUrl}/admin/addPaymentMethod` });
    const { changeState, loadingChange, responseChange } = useChangeState();

    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const initialItemData = state?.itemData || null;
    const [imageChanged, setImageChanged] = useState(false); // New state to track image changes

    // Determine if we're in "edit" mode based on whether itemData is provided
    const isEditMode = !!initialItemData;
    const title = isEditMode ? 'Edit Payment Method' : 'Add Payment Method';

    // Define the fields for the form based on provided JSON structure
    const fields = [
        { name: 'name', type: 'input', placeholder: 'Payment Method Name' },
        { name: 'phone', type: 'input', placeholder: 'Phone' },
        { name: 'account', type: 'input', placeholder: 'Account' },
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
            console.log('Initial Item Data:', initialItemData);
            setValues({
                id: initialItemData.id || '',
                name: initialItemData.name || '',
                phone: initialItemData.phone || '',
                account: initialItemData.account || '',
                status: initialItemData.status === 'Active' ? 'active' : 'inactive',
                image: initialItemData.img || null, // Image URL or file name
            });
            setImageChanged(false); // Reset imageChanged when loading initial data
        }
    }, [initialItemData]);

    const handleChange = (lang, name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
        if (name === 'image' && value !== null) {
            setImageChanged(true); // Mark image as changed when a new file is selected
        }
    };

    const handleSubmit = async () => {
        if (isEditMode) {
            const data = {
                id: values.id,
                name: values.name || '',
                phone: values.phone || '',
                account: values.account || '',
                status: values.status || 'inactive',
            };

            // Only include image if it was changed (imageChanged is true)
            if (imageChanged && values.image) {
                data.image = values.image;
            }
            await changeState(
                `${apiUrl}/admin/editPaymentMethod/${values.id}`,
                'Payment Method Updated Successfully!',
                data
            );
        } else {
            // Add mode: Use postData (POST request)
            const body = new FormData();
            body.append('name', values.name || '');
            body.append('phone', values.phone || '');
            body.append('account', values.account || '');
            body.append('status', values.status || 'inactive');
            if (values.image) {
                body.append('image', values.image);
            }
            await postData(body, 'Payment Method Added Successfully!');
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
            name: initialItemData.name || '',
            phone: initialItemData.phone || '',
            account: initialItemData.account || '',
            status: initialItemData.status === 'Active' ? 'active' : 'inactive',
            image: initialItemData.image || '',
        } : {});
        setImageChanged(false); // Reset imageChanged on reset
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

export default AddPaymentMethod;