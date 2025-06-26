import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Add from '@/components/AddFieldSection';
import { ArrowLeft, Plus } from 'lucide-react';
import { usePost } from '@/Hooks/UsePost';
import { useChangeState } from '@/Hooks/useChangeState';
import FullPageLoader from '@/components/Loading';
import { toast } from 'react-toastify';
import { useGet } from '@/Hooks/UseGet';

const AddPlans = ({ lang = 'en' }) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { postData, loadingPost, response: postResponse } = usePost({ url: `${apiUrl}/admin/addPlan` });
    const { changeState, loadingChange, responseChange } = useChangeState();
    const { refetch: refetchCategory, loading: loadingCategory, data: dataCategory } = useGet({ url: `${apiUrl}/admin/getJobCategories` });

    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const initialItemData = state?.itemData || null;
    const [categories, setCategories] = useState([]);

    const isEditMode = !!initialItemData;
    const title = isEditMode ? 'Edit Plan' : 'Add Plan';

    useEffect(() => {
        refetchCategory();
    }, [refetchCategory]);

    useEffect(() => {
        if (dataCategory && dataCategory.jobCategories) {
            const formatted = dataCategory?.jobCategories?.map((u) => ({
                label: u.name || "—",
                value: u.id.toString() || "", // Ensure ID is a string
            }));
            setCategories(formatted);
        }
    }, [dataCategory]);


    const fields = [
        {
            name: 'name',
            type: 'input',
            placeholder: 'Plan Name *',
            typeInput: 'text',
        },
        {
            name: 'description',
            type: 'textarea',
            placeholder: 'Plan Description *',
        },
        {
            name: 'price',
            type: 'input',
            placeholder: 'Price *',
            typeInput: 'number',
        },
        {
            name: 'price_after_discount',
            type: 'input',
            placeholder: 'Price After Discount',
            typeInput: 'number',
        },
        {
            name: 'type',
            type: 'select',
            placeholder: 'Plan Type *',
            options: [
                { label: 'Monthly', value: 'monthly' },
                { label: 'Yearly', value: 'yearly' },
            ],
        },
        {
            name: 'categories',
            type: 'multi-select',
            placeholder: 'Choose categories',
            options: categories,
            multiple: true, // Allow multiple selections
        },
        {
            type: 'switch',
            name: 'top_picked',
            placeholder: 'Top Picked CV',
            returnType: 'string',
            activeLabel: 'Top Picked',
            inactiveLabel: 'Not Top Picked',
        },
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
    const [cvNumber, setCvNumber] = useState('');
    const [featureInputs, setFeatureInputs] = useState([]);

    useEffect(() => {
        if (initialItemData) {
            setValues({
                id: initialItemData.id || '',
                name: initialItemData.name || '',
                description: initialItemData.description || '',
                price: initialItemData.price?.toString() || '',
                price_after_discount: initialItemData.price_after_discount?.toString() || '',
                type: initialItemData.type || '',
                // categories: initialItemData.job_categories
                //     ? initialItemData.job_categories.map(s => s.id.toString())
                //     : [],
                categories: Array.isArray(initialItemData.job_categories)
                    ? initialItemData.job_categories
                        .filter(s => s && s.id != null) // Ensure s and s.id are defined
                        .map(s => s.id.toString())
                    : [],
                top_picked: initialItemData.top_picked || 0,
                status: initialItemData.status || 'inactive',
            });

            if (initialItemData.features) {
                // Extract cv_number directly from the features object
                setCvNumber(initialItemData.features.cv_number?.toString() || '');

                // Convert other features to an array of { id, name, value } objects
                const otherFeatures = Object.entries(initialItemData.features)
                    .filter(([key]) => key !== 'cv_number')
                    .map(([key, value], index) => ({
                        id: index + 1,
                        name: key,
                        value: value,
                    }));
                setFeatureInputs(otherFeatures);
            }
        }
    }, [initialItemData]);

    const handleChange = (lang, name, value) => {
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const handleCvNumberChange = (e) => {
        setCvNumber(e.target.value);
    };

    const handleAddFeature = () => {
        const newId = featureInputs.length > 0 ? Math.max(...featureInputs.map(f => f.id)) + 1 : 1;
        setFeatureInputs([...featureInputs, { id: newId, name: `feature_${newId}`, value: '' }]);
    };

    const handleFeatureInputChange = (id, value) => {
        setFeatureInputs(prev =>
            prev.map(f => (f.id === id ? { ...f, value } : f))
        );
    };

    const handleRemoveFeature = (id) => {
        setFeatureInputs(prev => prev.filter(f => f.id !== id));
    };

    const handleSubmit = async () => {
        // Validate required fields
        if (!values.name || !values.description || !values.price || !values.type || !values.status) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Validate cv_number
        const cvNum = parseInt(cvNumber);
        if (isNaN(cvNum) || cvNum < 0 || cvNumber.trim() === '') {
            toast.error('Number of CVs must be a valid number');
            return;
        }

        if (isEditMode) {
            // Construct features as a flat object
            const featuresObj = {
                cv_number: cvNum,
                ...Object.fromEntries(
                    featureInputs
                        .filter(input => input.value.trim() !== '')
                        .map((input, index) => [`feature_${index + 1}`, input.value.trim()])
                ),
            };

            const data = {
                id: values.id,
                name: values.name,
                description: values.description,
                price: parseFloat(values.price),
                price_after_discount: values.price_after_discount ? parseFloat(values.price_after_discount) : null,
                type: values.type,
                job_category_ids: values.categories || [],
                top_picked: values.top_picked ? 1 : 0,
                status: values.status,
                features: featuresObj,
            };

            try {
                await changeState(
                    `${apiUrl}/admin/editPlan/${values.id}`,
                    'Plan Updated Successfully!',
                    data
                );
            } catch (error) {
                console.error('Error in edit mode:', error);
                toast.error('Failed to update plan');
            }
        } else {
            const body = new FormData();
            body.append('name', values.name);
            body.append('description', values.description);
            body.append('price', values.price);
            if (values.price_after_discount) {
                body.append('price_after_discount', values.price_after_discount);
            }
            body.append('type', values.type);
            values.categories.forEach((id) => {
                body.append('job_category_ids[]', parseInt(id));
            });
            body.append('top_picked', values.top_picked ? 1 : 0);
            body.append('status', values.status);

            // Append features as flat keys
            body.append('features[cv_number]', cvNum);
            featureInputs
                .filter(input => input.value.trim() !== '')
                .forEach((input, index) => {
                    body.append(`features[feature_${index + 1}]`, input.value.trim());
                });

            try {
                await postData(body, 'Plan Added Successfully!');
            } catch (error) {
                console.error('Error in add mode:', error);
                toast.error('Failed to add plan');
            }
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
            price: initialItemData.price?.toString() || '',
            price_after_discount: initialItemData.price_after_discount?.toString() || '',
            type: initialItemData.type || '',
            categories: initialItemData.categories || [],
            status: initialItemData.status || 'inactive',
        } : {});

        setCvNumber(initialItemData?.features?.cv_number?.toString() || '');
        if (initialItemData?.features) {
            const otherFeatures = Object.entries(initialItemData.features)
                .filter(([key]) => key !== 'cv_number')
                .map(([key, value], index) => ({
                    id: index + 1,
                    name: key,
                    value: value,
                }));
            setFeatureInputs(otherFeatures);
        } else {
            setFeatureInputs([]);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (loadingPost || loadingChange || loadingCategory || (isEditMode && !initialItemData)) {
        return <FullPageLoader />;
    }

    return (
        <div className=" p-4">
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

                {/* Features Section */}
                <div className="mt-4 p-6 bg-gray-50 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium text-gray-700">Features</h3>
                        <button
                            type="button"
                            onClick={handleAddFeature}
                            className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Feature
                        </button>
                    </div>

                    {/* CV Number Input */}
                    <div className="mb-2">
                        <input
                            type="number"
                            value={cvNumber}
                            onChange={handleCvNumberChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Number of CVs *"
                            required
                        />
                    </div>

                    {/* Additional Features */}
                    {featureInputs.map((input) => (
                        <div key={input.id} className="flex items-center mb-2">
                            <input
                                type="text"
                                value={input.value}
                                onChange={(e) => handleFeatureInputChange(input.id, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={`Feature ${input.id}`}
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveFeature(input.id)}
                                className="ml-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
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

export default AddPlans;