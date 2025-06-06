import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Add from '@/components/AddFieldSection';
import { ArrowLeft } from 'lucide-react';

const AddCorporate = ({ lang = 'en' }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const initialCorporateData = state?.corporateData || null;

    const isEditMode = !!initialCorporateData;
    const title = isEditMode ? 'Edit Company Information' : 'Company Information';

    const fields = [
        { name: 'companyLogo', type: 'file', placeholder: 'Select image from your device' },
        { name: 'companyName', type: 'input', placeholder: 'Name of company or organization' },
        { name: 'email', type: 'input', placeholder: 'Email', inputType: 'email' },
        { name: 'specializations', type: 'input', placeholder: 'Specializations' },
        { name: 'location', type: 'input', placeholder: 'Location (optional)' },
        { name: 'phoneNumber', type: 'input', placeholder: 'Phone number', inputType: 'tel' },
        { name: 'description', type: 'textarea', placeholder: 'Company description' },
        { name: 'twitter', type: 'input', placeholder: 'Twitter', inputType: 'url' },
        { name: 'facebook', type: 'input', placeholder: 'Facebook', inputType: 'url' },
        { name: 'linkedin', type: 'input', placeholder: 'LinkedIn', inputType: 'url' },
    ];

    const [values, setValues] = useState({});

    useEffect(() => {
        if (initialCorporateData) {
            setValues(initialCorporateData);
        }
    }, [initialCorporateData]);

    const handleChange = (lang, name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        console.log('Submitted:', values);
        navigate('/companies'); // Adjust the navigation path as needed
    };

    const handleReset = () => {
        setValues(initialCorporateData || {});
    };

    const handleBack = () => {
        navigate(-1);
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
                >
                    Reset
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-bg-secondary text-white rounded-md hover:bg-bg-secondary/90"
                >
                    {isEditMode ? 'Save Changes' : 'Add to System'}
                </button>
            </div>
        </div>
    );
};

export default AddCorporate;