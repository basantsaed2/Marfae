import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Add from '@/components/AddFieldSection';
import { ArrowLeft } from 'lucide-react';
import { usePost } from '@/Hooks/UsePost';
import { useChangeState } from '@/Hooks/useChangeState';
import { useGet } from '@/Hooks/UseGet';
import FullPageLoader from '@/components/Loading';
import { toast } from 'react-toastify';

const AddDoctors = ({ lang = 'en' }) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { postData, loadingPost, response: postResponse } = usePost({ url: `${apiUrl}/admin/create-doctor` });
    const { changeState, loadingChange, responseChange } = useChangeState();
    const { refetch: refetchSpecialization, loading: loadingSpecialization, data: dataSpecialization } = useGet({ url: `${apiUrl}/admin/getSpecializations` });
    const { refetch: refetchCountry, loading: loadingCountry, data: dataCountry } = useGet({ url: `${apiUrl}/admin/getCountries` });
    const { refetch: refetchCity, loading: loadingCity, data: dataCity } = useGet({ url: `${apiUrl}/admin/getCities` });
    const { refetch: refetchZone, loading: loadingZone, data: dataZone } = useGet({ url: `${apiUrl}/admin/getZones` });

    const [specializations, setSpecializations] = useState([]);
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [zones, setZones] = useState([]);
    const [imageChanged, setImageChanged] = useState(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    // Initialize values with default structure
    const [values, setValues] = useState({
        availability_days: [],
        doctor_name: '',
        clinic_name: '',
        country_id: '',
        city_id: '',
        zone_id: '',
        specialization_id: '',
        available_start_time: '',
        available_end_time: '',
        image: ''
    });

    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const initialItemData = state?.itemData || null;

    const isEditMode = !!initialItemData;
    const title = isEditMode ? 'Edit Doctor' : 'Add Doctor';

    // Days of week for availability
    const daysOfWeek = [
        { label: 'Saturday', value: 'saturday' },
        { label: 'Sunday', value: 'sunday' },
        { label: 'Monday', value: 'monday' },
        { label: 'Tuesday', value: 'tuesday' },
        { label: 'Wednesday', value: 'wednesday' },
        { label: 'Thursday', value: 'thursday' },
        { label: 'Friday', value: 'friday' }
    ];

    useEffect(() => {
        refetchSpecialization();
        refetchCountry();
        refetchCity();
        refetchZone();
    }, [refetchSpecialization, refetchCountry, refetchCity, refetchZone]);

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
        }
    }, [dataCity]);

    // This effect should run after initial data is set and when country_id changes
    useEffect(() => {
        if (cities.length > 0 && values.country_id) {
            const filtered = cities.filter(city => city.country_id === values.country_id);
            setFilteredCities(filtered);
            
            // If current city_id is not in filtered cities, reset it
            if (values.city_id && !filtered.some(city => city.value === values.city_id)) {
                setValues(prev => ({ ...prev, city_id: '' }));
            }
        } else if (cities.length > 0) {
            setFilteredCities(cities);
        }
    }, [cities, values.country_id, values.city_id]);

    useEffect(() => {
        if (values.country_id) {
            setValues((prev) => ({
                ...prev,
                city_id: '',
                zone_id: ''
            }));
        }
    }, [values.country_id]);

    useEffect(() => {
        if (dataZone && dataZone.zones && values.city_id) {
            const formatted = dataZone.zones
                .filter((zone) => zone.city_id.toString() === values.city_id)
                .map((u) => ({
                    label: u.name || "—",
                    value: u.id.toString(),
                }));
            setZones(formatted);
        } else {
            setZones([]);
        }
    }, [dataZone, values.city_id]);

    // Function to convert time format to H:i (24-hour format)
    const formatTimeToH_i = (timeString) => {
        if (!timeString) return '';
        
        // Remove seconds if present
        if (timeString.includes(':')) {
            const parts = timeString.split(':');
            if (parts.length >= 2) {
                return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
            }
        }
        
        return timeString;
    };

    // Updated fields according to API requirements
    const baseFields = [
        { name: 'doctor_name', type: 'input', placeholder: 'Doctor Name *' },
        { name: 'clinic_name', type: 'input', placeholder: 'Clinic Name' },
        { 
            name: 'country_id', 
            type: 'select', 
            placeholder: 'Select Country *', 
            options: countries 
        },
        { 
            name: 'city_id', 
            type: 'select', 
            placeholder: 'Select City *', 
            options: filteredCities 
        },
        { 
            name: 'zone_id', 
            type: 'select', 
            placeholder: 'Select Zone', 
            options: zones 
        },
        { 
            name: 'specialization_id', 
            type: 'select', 
            placeholder: 'Select Specialization *', 
            options: specializations 
        },
        { 
            name: 'availability_days', 
            type: 'multi-select', 
            placeholder: 'Select Availability Days *', 
            options: daysOfWeek,
            multiple: true 
        },
        { 
            name: 'available_start_time', 
            type: 'time', 
            placeholder: 'Available Start Time *',
            step: "60" // 1 minute steps
        },
        { 
            name: 'available_end_time', 
            type: 'time', 
            placeholder: 'Available End Time *',
            step: "60" // 1 minute steps
        },
        { type: 'file', placeholder: 'Image', name: 'image', accept: 'image/*' },
    ];

    useEffect(() => {
        if (initialItemData && countries.length > 0 && cities.length > 0 && specializations.length > 0) {
            
            const initialValues = {
                id: initialItemData.id || '',
                doctor_name: initialItemData.doctor_name || '',
                clinic_name: initialItemData.clinic_name || '',
                country_id: initialItemData.country_id?.toString() || '',
                city_id: initialItemData.city_id?.toString() || '',
                zone_id: initialItemData.zone_id?.toString() || '',
                specialization_id: initialItemData.specialization_id?.toString() || '',
                availability_days: Array.isArray(initialItemData.availability_days) 
                    ? initialItemData.availability_days 
                    : [],
                available_start_time: formatTimeToH_i(initialItemData.available_start_time) || '',
                available_end_time: formatTimeToH_i(initialItemData.available_end_time) || '',
                image: initialItemData.doctor_image || initialItemData.img || '',
            };
            
            setValues(initialValues);
            setIsDataLoaded(true);
        }
    }, [initialItemData, countries, cities, specializations]);

    const handleChange = (lang, name, value) => {
        if (name === 'image') {
            setImageChanged(true);
        }
        
        // Format time fields to ensure proper format
        if (name === 'available_start_time' || name === 'available_end_time') {
            value = formatTimeToH_i(value);
        }
        
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if ((!loadingChange && responseChange) || (!loadingPost && postResponse)) {
            navigate(-1);
        }
    }, [responseChange, postResponse, navigate]);

    const handleSubmit = async () => {
        // Validate required fields
        if (
            !values.doctor_name ||
            !values.country_id ||
            !values.city_id ||
            !values.specialization_id ||
            !values.availability_days || values.availability_days.length === 0 ||
            !values.available_start_time ||
            !values.available_end_time
        ) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Validate time format
        const timeFormat = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeFormat.test(values.available_start_time)) {
            toast.error('Please enter a valid start time in HH:MM format (24-hour)');
            return;
        }
        if (!timeFormat.test(values.available_end_time)) {
            toast.error('Please enter a valid end time in HH:MM format (24-hour)');
            return;
        }

        // Validate time range
        const startTime = new Date(`1970-01-01T${values.available_start_time}`);
        const endTime = new Date(`1970-01-01T${values.available_end_time}`);
        
        if (startTime >= endTime) {
            toast.error('End time must be after start time');
            return;
        }

        if (isEditMode) {
            // Edit mode: Use changeState (PUT request)
            const data = {
                id: values.id,
                doctor_name: values.doctor_name || '',
                clinic_name: values.clinic_name || '',
                country_id: parseInt(values.country_id),
                city_id: parseInt(values.city_id),
                specialization_id: parseInt(values.specialization_id),
                availability_days: values.availability_days,
                available_start_time: values.available_start_time,
                available_end_time: values.available_end_time,
            };

            // Add optional fields if they exist
            if (values.zone_id) {
                data.zone_id = parseInt(values.zone_id);
            }

            // Only include image if it has been changed
            if (imageChanged && values.image) {
                data.image = values.image;
            }

            await changeState(
                `${apiUrl}/admin/edit-doctor/${values.id}`,
                'Doctor Updated Successfully!',
                data
            );
        } else {
            // Add mode: Use postData (POST request)
            const body = new FormData();
            body.append('doctor_name', values.doctor_name || '');
            body.append('clinic_name', values.clinic_name || '');
            body.append('country_id', parseInt(values.country_id));
            body.append('city_id', parseInt(values.city_id));
            body.append('specialization_id', parseInt(values.specialization_id));
            body.append('available_start_time', values.available_start_time);
            body.append('available_end_time', values.available_end_time);
            
            // Append each availability day
            values.availability_days.forEach(day => {
                body.append('availability_days[]', day);
            });

            // Add optional fields if they exist
            if (values.zone_id) {
                body.append('zone_id', parseInt(values.zone_id));
            }

            // Only append image if it exists
            if (values.image) {
                body.append('image', values.image);
            }

            await postData(body, 'Doctor Added Successfully!');
        }
    };

    const handleReset = () => {
        setImageChanged(false);
        if (initialItemData) {
            const resetValues = {
                id: initialItemData.id || '',
                doctor_name: initialItemData.doctor_name || '',
                clinic_name: initialItemData.clinic_name || '',
                country_id: initialItemData.country_id?.toString() || '',
                city_id: initialItemData.city_id?.toString() || '',
                zone_id: initialItemData.zone_id?.toString() || '',
                specialization_id: initialItemData.specialization_id?.toString() || '',
                availability_days: Array.isArray(initialItemData.availability_days) 
                    ? initialItemData.availability_days 
                    : [],
                available_start_time: formatTimeToH_i(initialItemData.available_start_time) || '',
                available_end_time: formatTimeToH_i(initialItemData.available_end_time) || '',
                image: initialItemData.doctor_image || initialItemData.image || '',
            };
            
            setValues(resetValues);
        } else {
            setValues({
                availability_days: [],
                doctor_name: '',
                clinic_name: '',
                country_id: '',
                city_id: '',
                zone_id: '',
                specialization_id: '',
                available_start_time: '',
                available_end_time: '',
                image: ''
            });
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (loadingSpecialization || loadingCountry || loadingCity) {
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
                <Add fields={baseFields} lang={lang} values={values} onChange={handleChange} />
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

export default AddDoctors;