import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation and useNavigate
import Add from '@/components/AddFieldSection';
import { ArrowLeft } from 'lucide-react'; // Import ArrowLeft icon

const AddJob = ({ lang = 'en' }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const initialJobData = state?.jobData || null;

    // Determine if we're in "edit" mode based on whether jobData is provided
    const isEditMode = !!initialJobData;
    const title = isEditMode ? 'Edit Job' : 'Add a new Job';

    // Define the fields for the form
    const fields = [
        { name: 'jobTitle', type: 'input', placeholder: 'Job title' },
        {
            name: 'companyName', // Match the key from the jobData
            type: 'select',
            placeholder: 'Choose the company',
            options: [
                { value: 'Medical Center Hospital', label: 'Medical Center Hospital' },
                { value: 'Al Salam Hospital', label: 'Al Salam Hospital' },
                { value: 'Al-Shifa Laboratories', label: 'Al-Shifa Laboratories' },
            ],
        },
        {
            name: 'site', // Match the key from the jobData
            type: 'select',
            placeholder: 'Select the governorate',
            options: [
                { value: 'Cairo', label: 'Cairo' },
                { value: 'Alexandria', label: 'Alexandria' },
                { value: 'Suez', label: 'Suez' },
            ],
        },
        {
            name: 'jobCategory',
            type: 'select',
            placeholder: 'Select category',
            options: [
                { value: 'category1', label: 'Category 1' },
                { value: 'category2', label: 'Category 2' },
            ],
        },
        { name: 'jobDescription', type: 'textarea', placeholder: 'Job description' },
        { name: 'salary', type: 'input', placeholder: 'Enter your expected salary', inputType: 'number' },
        {
            name: 'employmentType',
            type: 'select',
            placeholder: 'Select the type of employment',
            options: [
                { value: 'fullTime', label: 'Full Time' },
                { value: 'partTime', label: 'Part Time' },
            ],
        },
    ];

    // State to manage form values
    const [values, setValues] = useState({});

    // Set initial values when jobData is provided
    useEffect(() => {
        if (initialJobData) {
            setValues(initialJobData);
        }
    }, [initialJobData]);

    const handleChange = (lang, name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        console.log('Submitted:', values);
        navigate('/jobs');
    };

    const handleReset = () => {
        setValues(initialJobData || {});
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
                >
                    Reset
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-bg-secondary text-white rounded-md hover:bg-bg-secondary/90"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default AddJob;