import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Add from '@/components/AddFieldSection';
import { ArrowLeft } from 'lucide-react';
import { usePost } from '@/Hooks/UsePost';
import { useChangeState } from '@/Hooks/useChangeState';
import { useGet } from '@/Hooks/UseGet';
import FullPageLoader from '@/components/Loading';
import { toast } from 'react-toastify';

const AddJob = ({ lang = 'en' }) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchCompanies, loading: loadingCompanies, data: dataCompanies } = useGet({ url: `${apiUrl}/admin/getCompanies` });
    const { refetch: refetchCategory, loading: loadingCategory, data: dataCategory } = useGet({ url: `${apiUrl}/admin/getJobCategories` });
    const { refetch: refetchCity, loading: loadingCity, data: dataCity } = useGet({ url: `${apiUrl}/admin/getCities` });
    const { refetch: refetchZone, loading: loadingZone, data: dataZone } = useGet({ url: `${apiUrl}/admin/getZones` });
    const { postData, loadingPost, response: postResponse } = usePost({ url: `${apiUrl}/admin/addJob` });
    const { changeState, loadingChange, responseChange } = useChangeState();

    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const initialItemData = state?.itemData || null;

    const isEditMode = !!initialItemData;
    const title = isEditMode ? 'Edit Job' : 'Add Job';

    const [companies, setCompanies] = useState([]);
    const [categories, setCategories] = useState([]);
    const [cities, setCities] = useState([]);
    const [zones, setZones] = useState([]);

    useEffect(() => {
        refetchCompanies();
        refetchCategory();
        refetchCity();
        refetchZone();
    }, [refetchCompanies, refetchCategory, refetchCity, refetchZone]);

    useEffect(() => {
        if (dataCompanies && dataCompanies.companies) {
            const formatted = dataCompanies.companies.map((c) => ({
                label: c.name || "—",
                value: c.id.toString(),
            }));
            setCompanies(formatted);
        }
    }, [dataCompanies]);

    useEffect(() => {
        if (dataCategory && dataCategory.jobCategories) {
            const formatted = dataCategory.jobCategories.map((u) => ({
                label: u.name || "—",
                value: u.id.toString(),
            }));
            setCategories(formatted);
        }
    }, [dataCategory]);

    useEffect(() => {
        if (dataCity && dataCity.cities) {
            const formatted = dataCity.cities.map((u) => ({
                label: u.name || "—",
                value: u.id.toString(),
            }));
            setCities(formatted);
        }
    }, [dataCity]);

    useEffect(() => {
        if (dataZone && dataZone.zones) {
            const formatted = dataZone.zones.map((u) => ({
                label: u.name || "—",
                value: u.id.toString(),
            }));
            setZones(formatted);
        }
    }, [dataZone]);

    const fields = [
        {
            name: 'company_id',
            type: 'select',
            placeholder: 'Select Company *',
            options: companies,
        },
        {
            name: 'job_category_id',
            type: 'select',
            placeholder: 'Select Job Category *',
            options: categories,
        },
        {
            name: 'city_id',
            type: 'select',
            placeholder: 'Select City *',
            options: cities,
        },
        {
            name: 'zone_id',
            type: 'select',
            placeholder: 'Select Zone *',
            options: zones,
        },
        {
            name: 'title',
            type: 'input',
            placeholder: 'Job Title *',
        },
        {
            name: 'description',
            type: 'textarea',
            placeholder: 'Job Description *',
        },
        {
            name: 'qualifications',
            type: 'textarea',
            placeholder: 'Qualifications *',
        },
        {
            name: 'image',
            type: 'file',
            placeholder: 'Upload Image',
            accept: 'image/*',
        },
        {
            name: 'type',
            type: 'select',
            placeholder: 'Job Type *',
            options: [
                { label: 'Full Time', value: 'full_time' },
                { label: 'Part Time', value: 'part_time' },
                { label: 'Freelance', value: 'freelance' },
                { label: 'Hybrid', value: 'hybrid' },
                { label: 'Internship', value: 'internship' },
            ],
        },
        {
            name: 'level',
            type: 'select',
            placeholder: 'Job Level *',
            options: [
                { label: 'Entry Level', value: 'entry_level' },
                { label: 'Intermediate', value: 'intermediate' },
                { label: 'Advanced', value: 'advanced' },
                { label: 'Expert', value: 'expert' },
            ],
        },
        {
            name: 'min_expected_salary',
            type: 'input',
            placeholder: 'Minimum Expected Salary *',
            typeInput: 'number',
        },
        {
            name: 'max_expected_salary',
            type: 'input',
            placeholder: 'Maximum Expected Salary *',
            typeInput: 'number',
        },
        {
            name: 'expire_date',
            type: 'input',
            placeholder: 'Expiration Date (YYYY-MM-DD) *',
            typeInput: 'date',
        },
        {
            name: 'location_link',
            type: 'input',
            placeholder: 'Location Link (e.g., Google Maps URL)',
        },
        {
            type: "switch",
            name: "status",
            placeholder: "Status",
            returnType: "string",
            activeLabel: "Active",
            inactiveLabel: "Inactive"
        },
    ];

    const [values, setValues] = useState({});

    useEffect(() => {
        if (initialItemData) {
            setValues({
                id: initialItemData.id || '',
                company_id: initialItemData.company_id?.toString() || '',
                job_category_id: initialItemData.job_category_id?.toString() || '',
                city_id: initialItemData.city_id?.toString() || '',
                zone_id: initialItemData.zone_id?.toString() || '',
                title: initialItemData.title || '',
                description: initialItemData.description || '',
                qualifications: initialItemData.qualifications || '',
                image: initialItemData.image || '',
                type: initialItemData.type || '',
                level: initialItemData.level || '',
                status: initialItemData.status || '',
                min_expected_salary: initialItemData.min_expected_salary?.toString() || '',
                max_expected_salary: initialItemData.max_expected_salary?.toString() || '',
                expire_date: initialItemData.expire_date || '',
                location_link: initialItemData.location_link || '',
            });
        }
    }, [initialItemData]);

    const handleChange = (lang, name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        // Validate required fields
        if (
            !values.company_id ||
            !values.job_category_id ||
            !values.city_id ||
            !values.zone_id ||
            !values.title ||
            !values.description ||
            !values.qualifications ||
            !values.type ||
            !values.level ||
            !values.status ||
            !values.min_expected_salary ||
            !values.max_expected_salary ||
            !values.expire_date
        ) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (parseFloat(values.min_expected_salary) > parseFloat(values.max_expected_salary)) {
            toast.error('Minimum salary cannot be greater than maximum salary');
            return;
        }

        if (isEditMode) {
            // Edit mode: Use changeState (PUT request)
            const data = {
                id: values.id,
                company_id: parseInt(values.company_id),
                job_category_id: parseInt(values.job_category_id),
                city_id: parseInt(values.city_id),
                zone_id: parseInt(values.zone_id),
                title: values.title,
                description: values.description,
                qualifications: values.qualifications,
                type: values.type,
                level: values.level,
                status: values.status,
                min_expected_salary: parseFloat(values.min_expected_salary),
                max_expected_salary: parseFloat(values.max_expected_salary),
                expire_date: values.expire_date,
                location_link: values.location_link || '',
            };
            await changeState(
                `${apiUrl}/admin/editJob/${values.id}`,
                'Job Updated Successfully!',
                data
            );
        } else {
            // Add mode: Use postData (POST request)
            const body = new FormData();
            body.append('company_id', values.company_id);
            body.append('job_category_id', values.job_category_id);
            body.append('city_id', values.city_id);
            body.append('zone_id', values.zone_id);
            body.append('title', values.title);
            body.append('description', values.description);
            body.append('qualifications', values.qualifications);
            if (values.image && typeof values.image !== 'string') {
                body.append('image', values.image);
            }
            body.append('type', values.type);
            body.append('level', values.level);
            body.append('status', values.status);
            body.append('min_expected_salary', values.min_expected_salary);
            body.append('max_expected_salary', values.max_expected_salary);
            body.append('expire_date', values.expire_date);
            body.append('location_link', values.location_link || '');

            await postData(body, 'Job Added Successfully!');
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
            company_id: initialItemData.company_id?.toString() || '',
            job_category_id: initialItemData.job_category_id?.toString() || '',
            city_id: initialItemData.city_id?.toString() || '',
            zone_id: initialItemData.zone_id?.toString() || '',
            title: initialItemData.title || '',
            description: initialItemData.description || '',
            qualifications: initialItemData.qualifications || '',
            image: initialItemData.image || '',
            type: initialItemData.type || '',
            level: initialItemData.level || '',
            status: initialItemData.status || '',
            min_expected_salary: initialItemData.min_expected_salary?.toString() || '',
            max_expected_salary: initialItemData.max_expected_salary?.toString() || '',
            expire_date: initialItemData.expire_date || '',
            location_link: initialItemData.location_link || '',
        } : {});
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (loadingCompanies || loadingCategory || loadingCity || loadingZone) {
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

export default AddJob;