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
                value: u.id.toString() || "",
            }));
            setCategories(formatted);
        }
    }, [dataCategory]);

    // Define all fields with showIf conditions - ONLY hide type and categories for user
    const allFields = [
        {
            name: 'name',
            type: 'input',
            placeholder: 'Plan Name *',
            inputType: 'text',
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
            inputType: 'number',
        },
        {
            name: 'price_after_discount',
            type: 'input',
            placeholder: 'Price After Discount',
            inputType: 'number',
        },
        {
            name: 'type',
            type: 'select',
            placeholder: 'Plan Type',
            options: [
                { label: 'Monthly', value: 'monthly' },
                { label: 'Yearly', value: 'yearly' },
            ],
            showIf: (values) => values.role !== 'user' // ONLY hide this for user
        },
        {
            name: 'categories',
            type: 'multi-select',
            placeholder: 'Choose categories',
            options: categories,
            multiple: true,
            showIf: (values) => values.role !== 'user' // ONLY hide this for user
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

    const [values, setValues] = useState({ role: 'user' });
    const [cvNumber, setCvNumber] = useState('');
    const [jobNumber, setJobNumber] = useState('');
    const [featureInputs, setFeatureInputs] = useState([]);

    const currentRole = values.role || 'user';

    useEffect(() => {
        if (initialItemData) {
            const features = initialItemData.features || {};
            
            setValues({
                id: initialItemData.id || '',
                name: initialItemData.name || '',
                description: initialItemData.description || '',
                price: initialItemData.price?.toString() || '',
                price_after_discount: initialItemData.price_after_discount?.toString() || '',
                type: initialItemData.type || '',
                role: initialItemData.role || 'user',
                categories: Array.isArray(initialItemData.job_categories)
                    ? initialItemData.job_categories
                        .filter(s => s && s.id != null)
                        .map(s => s.id.toString())
                    : [],
                top_picked: initialItemData.top_picked || 0,
                status: initialItemData.status || 'inactive',
            });

            // Set cvNumber from features
            setCvNumber(features.cv_number?.toString() || '');
            setJobNumber(features.job_add?.toString() || '');

            const otherFeatures = Object.entries(features)
                .filter(([key]) => key !== 'cv_number' && key !== 'job_add')
                .map(([key, value], index) => ({
                    id: index + 1,
                    name: key,
                    value: value?.toString() || '',
                }));
            setFeatureInputs(otherFeatures);
        } else {
            setValues(prev => ({ ...prev, role: 'user', status: 'inactive' }));
            // Initialize with empty values
            setCvNumber('');
            setJobNumber('');
            setFeatureInputs([]);
        }
    }, [initialItemData]);

    const handleChange = (lang, name, value) => {
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const handleCvNumberChange = (e) => {
        // Only allow changes if role is not user
        if (currentRole !== 'user') {
            setCvNumber(e.target.value);
        }
    };

    const handleJobNumberChange = (e) => {
        setJobNumber(e.target.value);
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
        if (!values.name || !values.description || !values.price || !values.role || !values.status) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Only validate cv_number for employer role
        if (currentRole !== 'user') {
            const cvNum = parseInt(cvNumber);
            if (isNaN(cvNum) || cvNum < 0 || cvNumber.trim() === '') {
                toast.error('Number of CVs must be a valid number for employer plans');
                return;
            }
        }

        if (isEditMode) {
            // Construct features
            const featuresObj = {};
            
            // Always include job_add
            featuresObj.job_add = '800';
            
            // Include cv_number only for employer role
            if (currentRole !== 'user') {
                if (cvNumber.trim() !== '') {
                    const cvNum = parseInt(cvNumber);
                    if (!isNaN(cvNum) && cvNum >= 0) {
                        featuresObj.cv_number = cvNum;
                    }
                }
            }
            
            // Include additional features if they exist
            const additionalFeatures = featureInputs
                .filter(input => input.value.trim() !== '')
                .reduce((acc, input, index) => {
                    acc[`feature_${index + 1}`] = input.value.trim();
                    return acc;
                }, {});
            
            Object.assign(featuresObj, additionalFeatures);

            const data = {
                id: values.id,
                name: values.name,
                description: values.description,
                price: parseFloat(values.price),
                price_after_discount: values.price_after_discount ? parseFloat(values.price_after_discount) : null,
                type: currentRole !== 'user' ? values.type : null,
                role: values.role,
                job_category_ids: currentRole !== 'user' ? (values.categories || []) : [],
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
            // Only append type for employer
            if (currentRole !== 'user' && values.type) {
                body.append('type', values.type);
            }
            body.append('role', values.role);
            
            // Only append categories for employer
            if (currentRole !== 'user' && values.categories && values.categories.length > 0) {
                values.categories.forEach((id) => {
                    body.append('job_category_ids[]', parseInt(id));
                });
            }
            
            body.append('top_picked', values.top_picked ? 1 : 0);
            body.append('status', values.status);

            // Append features
            body.append('features[job_add]', 800);
            
            // Append cv_number only for employer role
            if (currentRole !== 'user') {
                if (cvNumber.trim() !== '') {
                    const cvNum = parseInt(cvNumber);
                    if (!isNaN(cvNum) && cvNum >= 0) {
                        body.append('features[cv_number]', cvNum);
                    }
                }
            }

            // Append additional features if they exist
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
        if ((!loadingChange && responseChange?.status===200) || (!loadingPost && postResponse?.status===200)) {
            navigate(-1);
        }
    }, [responseChange, postResponse, navigate]);

    const handleReset = () => {
        if (initialItemData) {
            const features = initialItemData.features || {};
            
            setValues({
                id: initialItemData.id || '',
                name: initialItemData.name || '',
                description: initialItemData.description || '',
                price: initialItemData.price?.toString() || '',
                price_after_discount: initialItemData.price_after_discount?.toString() || '',
                type: initialItemData.type || '',
                role: initialItemData.role || 'user',
                categories: Array.isArray(initialItemData.job_categories)
                    ? initialItemData.job_categories
                        .filter(s => s && s.id != null)
                        .map(s => s.id.toString())
                    : [],
                top_picked: initialItemData.top_picked || 0,
                status: initialItemData.status || 'inactive',
            });

            setCvNumber(features.cv_number?.toString() || '');
            setJobNumber(features.job_add?.toString() || '');

            const otherFeatures = Object.entries(features)
                .filter(([key]) => key !== 'cv_number' && key !== 'job_add')
                .map(([key, value], index) => ({
                    id: index + 1,
                    name: key,
                    value: value?.toString() || '',
                }));
            setFeatureInputs(otherFeatures);
        } else {
            setValues({ role: 'user', status: 'inactive' });
            setCvNumber('');
            setJobNumber('');
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
        <div className="p-4">
            <div className="flex items-center mb-6">
                <button
                    type="button"
                    onClick={handleBack}
                    className="p-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 mr-3 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h2 className="text-2xl text-bg-primary font-bold">{title}</h2>
            </div>

            <div className="py-8 px-6 bg-white rounded-lg shadow-md border border-gray-200">
                {/* Plan Name Field */}
                <div className="mb-6">
                    <Add
                        fields={allFields.filter(field => field.name === 'name')}
                        lang={lang}
                        values={values}
                        onChange={handleChange}
                    />
                </div>

                {/* Role Selection as Radio Buttons */}
                <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <label className="block text-lg font-semibold text-gray-800 mb-4">
                        Plan Role *
                    </label>
                    <div className="flex gap-8">
                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="radio"
                                    name="role"
                                    value="user"
                                    checked={currentRole === 'user'}
                                    onChange={(e) => handleChange(lang, 'role', e.target.value)}
                                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-400 cursor-pointer"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                                    User Plan
                                </span>
                            </div>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="radio"
                                    name="role"
                                    value="employeer"
                                    checked={currentRole === 'employeer'}
                                    onChange={(e) => handleChange(lang, 'role', e.target.value)}
                                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-400 cursor-pointer"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                                    Employer Plan
                                </span>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Conditional Fields */}
                <div className="space-y-6">
                    <Add
                        fields={allFields.filter(field => 
                            field.name !== 'name' && 
                            (!field.showIf || field.showIf(values))
                        )}
                        lang={lang}
                        values={values}
                        onChange={handleChange}
                    />
                </div>

                {/* Features Section */}
                <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Plan Features</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                {currentRole === 'user' 
                                    ? 'User plans have limited features' 
                                    : 'Configure the features available in this employer plan'
                                }
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleAddFeature}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Feature
                        </button>
                    </div>

                    {/* CV Number Input - DISABLED for user role */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Number of CVs {currentRole !== 'user' && <span className="text-red-500">*</span>}
                        </label>
                        <input
                            type="number"
                            value={cvNumber}
                            onChange={handleCvNumberChange}
                            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                currentRole === 'user' ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''
                            }`}
                            placeholder={
                                currentRole === 'user' 
                                    ? "Not available for user plans" 
                                    : "Enter number of CVs allowed *"
                            }
                            min="0"
                            required={currentRole !== 'user'}
                            disabled={currentRole === 'user'} // This makes the input disabled for user role
                        />
                        {currentRole === 'user' ? (
                            <p className="text-xs text-gray-500 mt-1">
                                CV number feature is not available for user plans
                            </p>
                        ) : (
                            <p className="text-xs text-red-500 mt-1">
                                Required: Enter the number of CVs this employer plan can access
                            </p>
                        )}
                    </div>

                    {/* Additional Features - Optional for both */}
                    {featureInputs.length > 0 && (
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Additional Features (Optional)
                            </label>
                            {featureInputs.map((input) => (
                                <div key={input.id} className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={input.value}
                                        onChange={(e) => handleFeatureInputChange(input.id, e.target.value)}
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder={`Enter feature ${input.id} (Optional)`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFeature(input.id)}
                                        className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors whitespace-nowrap"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end gap-4">
                <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                    disabled={loadingPost || loadingChange}
                >
                    Reset
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-bg-secondary text-white rounded-lg hover:bg-bg-secondary/90 transition-colors font-medium"
                    disabled={loadingPost || loadingChange}
                >
                    {loadingPost || loadingChange ? 'Submitting...' : isEditMode ? 'Update Plan' : 'Create Plan'}
                </button>
            </div>
        </div>
    );
};

export default AddPlans;