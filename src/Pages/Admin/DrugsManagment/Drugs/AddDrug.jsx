import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Add from '@/components/AddFieldSection';
import { ArrowLeft } from 'lucide-react';
import { usePost } from '@/Hooks/UsePost';
import { useChangeState } from '@/Hooks/useChangeState';
import { useGet } from '@/Hooks/UseGet';
import { toast } from 'react-toastify';
import FullPageLoader from '@/components/Loading';

const AddDrug = ({ lang = 'en' }) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { postData, loadingPost, response: postResponse } = usePost({ url: `${apiUrl}/admin/addDrug` });
    const { changeState, loadingChange, responseChange } = useChangeState();
    const { refetch: refetchCompany, loading: loadingCompany, data: dataCompany } = useGet({ url: `${apiUrl}/admin/getCompanies` });
    const { refetch: refetchDrugCategory, loading: loadingDrugCategory, data: dataDrugCategory } = useGet({ url: `${apiUrl}/admin/getDrugCategories` });

    const [Companies, setCompanies] = useState([]);
    const [Categories, setCategories] = useState([]);
    const [imageChanged, setImageChanged] = useState(false); // New state to track image changes

    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const initialItemData = state?.itemData || null;

    const isEditMode = !!initialItemData;
    const title = isEditMode ? 'Edit Drug' : 'Add Drug';

    useEffect(() => {
        refetchCompany();
        refetchDrugCategory();
    }, [refetchCompany, refetchDrugCategory]);

    useEffect(() => {
        if (dataCompany && dataCompany.companies) {
            const formatted = dataCompany.companies.map((u) => ({
                label: u.name || "—",
                value: u.id.toString() || "",
            }));
            setCompanies(formatted);
        }
    }, [dataCompany]);

    useEffect(() => {
        if (dataDrugCategory && dataDrugCategory.drug_categories) {
            const formatted = dataDrugCategory.drug_categories.map((u) => ({
                label: u.name || "—",
                value: u.id.toString() || "",
            }));
            setCategories(formatted);
        }
    }, [dataDrugCategory]);

    const fields = [
        { name: 'name', type: 'input', placeholder: 'Drug Name *' },
        { name: 'description', type: 'input', placeholder: 'Drug Description *' },
        {
            name: 'company_id',
            type: 'select',
            placeholder: 'Choose the company *',
            options: Companies,
        },
        {
            name: 'drug_category_id',
            type: 'select',
            placeholder: 'Choose the category *',
            options: Categories,
        },
        { type: 'file', placeholder: 'Image', name: 'image', accept: 'image/*' },
    ];

    const [values, setValues] = useState({
        id: '',
        name: '',
        description: '',
        company_id: '',
        drug_category_id: '',
        image: null,
    });

    useEffect(() => {
        if (initialItemData) {
            setValues({
                id: initialItemData.id || '',
                name: initialItemData.name || '',
                description: initialItemData.description || '',
                company_id: initialItemData.company_id?.toString() || '',
                drug_category_id: initialItemData.drug_category_id?.toString() || '',
                image: initialItemData.image || null, // Keep as URL/path or null
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
        // Validate required fields
        if (!values.name || !values.description || !values.company_id) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            if (isEditMode) {
                const body = new FormData();
                body.append('id', values.id);
                body.append('name', values.name);
                body.append('description', values.description);
                body.append('company_id', values.company_id);
                body.append('drug_category_id', values.drug_category_id);
                if (imageChanged && values.image) {
                    body.append('image', values.image); // Only append image if changed
                }
                await changeState(
                    `${apiUrl}/admin/editDrug/${values.id}`,
                    'Drug Updated Successfully!',
                    body
                );
            } else {
                const body = new FormData();
                body.append('name', values.name);
                body.append('description', values.description);
                body.append('company_id', values.company_id);
                body.append('drug_category_id', values.drug_category_id);
                if (values.image) {
                    body.append('image', values.image);
                }
                await postData(body, 'Drug Added Successfully!');
            }
        } catch (error) {
            toast.error('Failed to submit drug: ' + error.message);
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
            company_id: initialItemData.company_id?.toString() || '',
            drug_category_id: initialItemData.drug_category_id?.toString() || '',
            image: initialItemData.image || null,
        } : {
            id: '',
            name: '',
            description: '',
            company_id: '',
            drug_category_id: '',
            image: null,
        });
        setImageChanged(false); // Reset imageChanged on reset
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (loadingCompany) {
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

export default AddDrug;