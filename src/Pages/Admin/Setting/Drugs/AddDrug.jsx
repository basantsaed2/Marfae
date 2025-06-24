import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Add from '@/components/AddFieldSection';
import { ArrowLeft } from 'lucide-react';
import { usePost } from '@/Hooks/UsePost';
import { useChangeState } from '@/Hooks/useChangeState';
import { useGet } from '@/Hooks/UseGet';

const AddDrug = ({ lang = 'en' }) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { postData, loadingPost, response: postResponse } = usePost({ url: `${apiUrl}/admin/addDrug` });
    const { changeState, loadingChange, responseChange } = useChangeState();
    const { refetch: refetchCompany, loading: loadingCompany, data: dataCompany } = useGet({ url: `${apiUrl}/admin/getCompanies` });

    const [Companys, setCompanys] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const initialItemData = state?.itemData || null;

    // Determine if we're in "edit" mode based on whether itemData is provided
    const isEditMode = !!initialItemData;
    const title = isEditMode ? 'Edit Drug' : 'Add Drug';

    useEffect(() => {
        refetchCompany();
    }, [refetchCompany]);

    useEffect(() => {
        if (dataCompany && dataCompany.companies) {
            const formatted = dataCompany?.companies?.map((u) => ({
                label: u.name || "—",
                value: u.id.toString() || "", // Ensure ID is a string
            }));
            setCompanys(formatted);
        }
    }, [dataCompany]);

    // Define the fields for the form based on provided JSON structure
    const fields = [
        { name: 'name', type: 'input', placeholder: 'Drug Name' },
        { name: 'description', type: 'input', placeholder: 'Drug Description' },
        {
            name: 'Company',
            type: 'select',
            placeholder: 'Choose the Company',
            options: Companys,
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
                name: initialItemData.name || '',
                description: initialItemData.description || '',
                Company: initialItemData.Company || '',
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
                name: values.name || '',
                description: values.description || '',
                company_id: values.Company || '',
                status: values.status || 'inactive',
            };
            await changeState(
                `${apiUrl}/admin/editDrug/${values.id}`,
                'Drug Updated Successfully!',
                data
            );
        } else {
            // Add mode: Use postData (POST request)
            const body = new FormData();
            body.append('name', values.name || '');
            body.append('description', values.description || '');
            body.append('company_id', values.Company || '');
            body.append('status', values.status || 'inactive');
            if (values.image && typeof values.image !== 'string') {
                body.append('image', values.image);
            }

            await postData(body, 'Drug Added Successfully!');
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
            description: initialItemData.description || '',
            Company: initialItemData.Company || '',
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

export default AddDrug;