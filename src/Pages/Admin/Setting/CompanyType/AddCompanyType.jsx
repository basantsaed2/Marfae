import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Add from '@/components/AddFieldSection';
import { ArrowLeft } from 'lucide-react';
import { usePost } from '@/Hooks/UsePost';
import { useChangeState } from '@/Hooks/useChangeState';

const AddCompanyType = ({ lang = 'en' }) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { postData, loadingPost, response: postResponse } = usePost({ url: `${apiUrl}/admin/addCompanyType` });
    const { changeState, loadingChange, responseChange } = useChangeState();

    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const initialItemData = state?.itemData || null;

    // Determine if we're in "edit" mode based on whether itemData is provided
    const isEditMode = !!initialItemData;
    const title = isEditMode ? 'Edit Organization Type' : 'Add Organization Type';

    // Define the fields for the form
    const fields = [
        { name: 'CompanyType', type: 'input', placeholder: 'Organization Type Name' },
        {
            type: "switch",
            name: "status",
            placeholder: "Status",
            returnType: "string",
            activeLabel: "Active",
            inactiveLabel: "Inactive"
        },
    ];

    // State to manage form values
    const [values, setValues] = useState({});

    // Set initial values when itemData is provided
    useEffect(() => {
        if (initialItemData) {
            console.log("initialItemData", initialItemData)
            setValues({
                id: initialItemData.id || '',
                CompanyType: initialItemData.CompanyType || '',
                status: initialItemData.status  === "Active" ? "active" : "inactive",
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
                id: values.id || "",
                name: values.CompanyType || "",
                status: values.status || "inactive",
            };
            await changeState(
                `${apiUrl}/admin/editCompanyType/${values.id}`,
                "Company Type Updated Successfully!",
                data
            );
        } else {
            // Add mode: Use postData (POST request)
            const body = new FormData();
            body.append("name", values.CompanyType || "");
            body.append("status", values.status || "inactive");
            await postData(body, "Organization Type Added Successfully!");
        }
    };

    useEffect(() => {
        if ((!loadingChange && responseChange) || (!loadingPost && postResponse)) {
            navigate(-1);
        }
    }, [responseChange, postResponse]);

    const handleReset = () => {
        setValues(initialItemData ? {
            id: initialItemData.id || '',
            CompanyType: initialItemData.CompanyType || '',
            status: initialItemData.status === "Active" ? "active" : "inactive",
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

            <div className='py-10 px-4 bg-white rounded-lg shadow-md'>
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
                    {loadingPost || loadingChange ? "Submitting..." : isEditMode ? "Update" : "Submit"}
                </button>
            </div>
        </div>
    );
};

export default AddCompanyType;