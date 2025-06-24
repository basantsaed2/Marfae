import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Add from '@/components/AddFieldSection';
import { ArrowLeft } from 'lucide-react';
import { usePost } from '@/Hooks/UsePost';
import { useChangeState } from '@/Hooks/useChangeState';
import { useGet } from '@/Hooks/UseGet';
import { toast } from 'react-toastify';

const AddCorporate = ({ lang = 'en' }) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { postData, loadingPost, response: postResponse } = usePost({ url: `${apiUrl}/admin/addCompany` });
    const { changeState, loadingChange, responseChange } = useChangeState();
    const { refetch: refetchSpecialization, loading: loadingSpecialization, data: dataSpecialization } = useGet({ url: `${apiUrl}/admin/getSpecializations` });
    const { refetch: refetchCompanyType, loading: loadingCompanyType, data: dataCompanyType } = useGet({ url: `${apiUrl}/admin/getActiveCompanyTypes` });

    const [specializations, setSpecializations] = useState([]);
    const [companyType, setCompanyType] = useState([]);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const initialItemData = state?.companyDetails || null;

    // Determine if we're in "edit" mode based on whether companyDetails is provided
    const isEditMode = !!initialItemData;
    const title = isEditMode ? 'Edit Company' : 'Add Company';

    useEffect(() => {
        refetchSpecialization();
        refetchCompanyType();
    }, [refetchSpecialization, refetchCompanyType]);

    useEffect(() => {
        if (dataSpecialization && dataSpecialization.specializations) {
            const formatted = dataSpecialization?.specializations?.map((u) => ({
                label: u.name || "—",
                value: u.id.toString() || "", // Ensure ID is a string
            }));
            setSpecializations(formatted);
        }
    }, [dataSpecialization]);

    useEffect(() => {
        if (dataCompanyType && dataCompanyType.company_types) {
            const formatted = dataCompanyType?.company_types?.map((u) => ({
                label: u.name || "—",
                value: u.id.toString() || "", // Ensure ID is a string
            }));
            setCompanyType(formatted);
        }
    }, [dataCompanyType]);

    // Define the fields for the form based on provided JSON structure
    const fields = [
        { name: 'name', type: 'input', placeholder: 'Company Name *' },
        { name: 'email', type: 'input', placeholder: 'Email *', typeInput: 'email' },
        { name: 'phone', type: 'input', placeholder: 'Phone *', typeInput: 'tel' },
        { name: 'location_link', type: 'input', placeholder: 'Location (e.g., Google Maps URL)' },
        { name: 'description', type: 'textarea', placeholder: 'Tell us about your company...' },
        { name: 'twitter_link', type: 'input', placeholder: 'Twitter URL' },
        { name: 'facebook_link', type: 'input', placeholder: 'Facebook URL' },
        { name: 'linkedin_link', type: 'input', placeholder: 'LinkedIn URL' },
        { name: 'site_link', type: 'input', placeholder: 'Website URL' },
        {
            name: 'specializations',
            type: 'multi-select',
            placeholder: 'Choose specializations',
            options: specializations,
            multiple: true, // Allow multiple selections
        },
        {
            name: 'companyType',
            type: 'select',
            placeholder: 'Choose Company Type',
            options: companyType,
            multiple: true, // Allow multiple selections
        },
        { type: 'file', placeholder: 'Upload Logo', name: 'image', accept: 'image/*' },
    ];

    // State to manage form values
    const [values, setValues] = useState({});

    // Set initial values when companyDetails is provided
    useEffect(() => {
        if (initialItemData) {
            setValues({
                id: initialItemData.id || '',
                name: initialItemData.name || '',
                email: initialItemData.email || '',
                phone: initialItemData.phone || '',
                location_link: initialItemData.location_link || '',
                description: initialItemData.description || '',
                twitter_link: initialItemData.twitter_link || '',
                facebook_link: initialItemData.facebook_link || '',
                linkedin_link: initialItemData.linkedin_link || '',
                site_link: initialItemData.site_link || '',
                specializations: initialItemData.specializations || [],
                companyType: initialItemData.companyType || [],
                image: initialItemData.image || '',
            });
        }
    }, [initialItemData]);

    const handleChange = (lang, name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        // Validate required fields
        if (!values.name || !values.email || !values.phone || !values.description) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (isEditMode) {
            // Edit mode: Use changeState (PUT request)
            const data = {
                id: values.id,
                name: values.name,
                email: values.email,
                phone: values.phone,
                location_link: values.location_link || '',
                description: values.description,
                twitter_link: values.twitter_link || '',
                facebook_link: values.facebook_link || '',
                linkedin_link: values.linkedin_link || '',
                site_link: values.site_link || '',
                specializations: values.specializations || [],
                type: values.companyType || '',
            };
            await changeState(
                `${apiUrl}/admin/editCompany/${values.id}`,
                'Company Updated Successfully!',
                data
            );
        } else {
            // Add mode: Use postData (POST request)
            const body = new FormData();
            body.append('name', values.name || '');
            body.append('email', values.email || '');
            body.append('phone', values.phone || '');
            body.append('location_link', values.location_link || '');
            body.append('description', values.description || '');
            body.append('twitter_link', values.twitter_link || '');
            body.append('facebook_link', values.facebook_link || '');
            body.append('linkedin_link', values.linkedin_link || '');
            body.append('site_link', values.site_link || '');
            values.specializations.forEach((id) => {
                body.append('specializations[]', parseInt(id));
            }); body.append('type', values.companyType || '');
            if (values.image && typeof values.image !== 'string') {
                body.append('image', values.image);
            }

            await postData(body, 'Company Added Successfully!');
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
            email: initialItemData.email || '',
            phone: initialItemData.phone || '',
            location_link: initialItemData.location_link || '',
            description: initialItemData.description || '',
            twitter_link: initialItemData.twitter_link || '',
            facebook_link: initialItemData.facebook_link || '',
            linkedin_link: initialItemData.linkedin_link || '',
            site_link: initialItemData.site_link || '',
            specializations: initialItemData.specializations || [],
            companyType: initialItemData.companyType || '',
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

export default AddCorporate;