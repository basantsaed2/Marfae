import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Add from '@/components/AddFieldSection';
import { ArrowLeft } from 'lucide-react';
import { usePost } from '@/Hooks/UsePost';
import { useChangeState } from '@/Hooks/useChangeState';
import { useGet } from '@/Hooks/UseGet';
import { toast } from 'react-toastify';
import FullPageLoader from '@/components/Loading';

const AddCorporate = ({ lang = 'en' }) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { postData, loadingPost, response: postResponse } = usePost({ url: `${apiUrl}/admin/addCompany` });
    const { changeState, loadingChange, responseChange } = useChangeState();
    const { refetch: refetchSpecialization, loading: loadingSpecialization, data: dataSpecialization } = useGet({ url: `${apiUrl}/admin/getSpecializations` });
    const { refetch: refetchCompanyType, loading: loadingCompanyType, data: dataCompanyType } = useGet({ url: `${apiUrl}/admin/getActiveCompanyTypes` });
    const { refetch: refetchCountry, loading: loadingCountry, data: dataCountry } = useGet({ url: `${apiUrl}/admin/getCountries` });
    const { refetch: refetchCity, loading: loadingCity, data: dataCity } = useGet({ url: `${apiUrl}/admin/getCities` });

    const [specializations, setSpecializations] = useState([]);
    const [companyType, setCompanyType] = useState([]);
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [imageChanged, setImageChanged] = useState(false); // Track if image has been changed

    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const initialItemData = state?.companyDetails || null;

    const isEditMode = !!initialItemData;
    const title = isEditMode ? 'Edit Company' : 'Add Company';

    // Initialize values state with default empty values
    const [values, setValues] = useState({
        id: '',
        name: '',
        email: '',
        phone: '',
        location_link: '',
        description: '',
        twitter_link: '',
        facebook_link: '',
        linkedin_link: '',
        site_link: '',
        specializations: [],
        companyType: '',
        country_id: '',
        city_id: '',
        image: '',
    });

    useEffect(() => {
        refetchSpecialization();
        refetchCompanyType();
        refetchCountry();
        refetchCity();
    }, [refetchSpecialization, refetchCompanyType, refetchCountry, refetchCity]);

    useEffect(() => {
        if (dataSpecialization && dataSpecialization.specializations) {
            const formatted = dataSpecialization?.specializations?.map((u) => ({
                label: u.name || "—",
                value: u.id.toString() || "",
            }));
            setSpecializations(formatted);
        }
    }, [dataSpecialization]);

    useEffect(() => {
        if (dataCompanyType && dataCompanyType.company_types) {
            const formatted = dataCompanyType?.company_types?.map((u) => ({
                label: u.name || "—",
                value: u.id.toString() || "",
            }));
            setCompanyType(formatted);
        }
    }, [dataCompanyType]);

    useEffect(() => {
        if (dataCountry && dataCountry.countries) {
            const formatted = dataCountry?.countries?.map((u) => ({
                label: u.name || "—",
                value: u.id.toString() || "",
            }));
            setCountries(formatted);
        }
    }, [dataCountry]);

    useEffect(() => {
        if (dataCity && dataCity.cities) {
            const formatted = dataCity?.cities?.map((u) => ({
                label: u.name || "—",
                value: u.id.toString() || "",
                country_id: u.country_id.toString(),
            }));
            setCities(formatted);

            if (values.country_id) {
                const filtered = formatted.filter(city => city.country_id === values.country_id);
                setFilteredCities(filtered);
            } else {
                setFilteredCities(formatted);
            }
        }
    }, [dataCity, values.country_id]);

    useEffect(() => {
        if (values.country_id) {
            setValues((prev) => ({
                ...prev,
                city_id: '',
            }));
        }
    }, [values.country_id]);

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
                specializations: initialItemData.specializations
                    ? initialItemData.specializations.map(s => s.id.toString())
                    : [],
                companyType: initialItemData.companyType || '',
                image: initialItemData.image || '',
                country_id: initialItemData.country_id || '',
                city_id: initialItemData.city_id || '',
            });
        }
    }, [initialItemData]);

    const handleChange = (lang, name, value) => {
        if (name === 'image') {
            setImageChanged(true); // Mark image as changed
        }
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!values.name || !values.email || !values.phone || !values.description || !values.country_id || !values.city_id) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (isEditMode) {
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
                company_type_id: values.companyType || '',
                country_id: values.country_id || '',
                city_id: values.city_id || '',
            };

            // Only include image if it has been changed
            if (imageChanged && values.image) {
                data.image = values.image;
            }

            await changeState(
                `${apiUrl}/admin/editCompany/${values.id}`,
                'Company Updated Successfully!',
                data
            );
        } else {
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
            });
            body.append('company_type_id', values.companyType || '');
            body.append('country_id', values.country_id || '');
            body.append('city_id', values.city_id || '');
            if (imageChanged && values.image && typeof values.image !== 'string') {
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
        setImageChanged(false); // Reset image change flag
        setValues(
            initialItemData
                ? {
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
                    specializations: initialItemData.specializations
                        ? initialItemData.specializations.map(s => s.id.toString())
                        : [],
                    companyType: initialItemData.companyType || '',
                    country_id: initialItemData.country_id || '',
                    city_id: initialItemData.city_id || '',
                    image: initialItemData.image || '',
                } : {
                    id: '',
                    name: '',
                    email: '',
                    phone: '',
                    location_link: '',
                    description: '',
                    twitter_link: '',
                    facebook_link: '',
                    linkedin_link: '',
                    site_link: '',
                    specializations: [],
                    companyType: '',
                    country_id: '',
                    city_id: '',
                    image: '',
                });
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (loadingSpecialization || loadingCompanyType || loadingCountry || loadingCity) {
        return <FullPageLoader />;
    }

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
            multiple: true,
        },
        {
            name: 'companyType',
            type: 'select',
            placeholder: 'Choose Company Type',
            options: companyType,
            multiple: false, // Corrected to false as it's a single select
        },
        {
            name: 'country_id',
            type: 'select',
            placeholder: 'Select Job Country *',
            options: countries,
        },
        {
            name: 'city_id',
            type: 'select',
            placeholder: 'Select Job City *',
            options: filteredCities,
        },
        { type: 'file', placeholder: 'Upload Logo', name: 'image', accept: 'image/*' },
    ];

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