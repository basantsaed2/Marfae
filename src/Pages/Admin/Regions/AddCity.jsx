import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Add from '@/components/AddFieldSection';
import { ArrowLeft } from 'lucide-react';
import { usePost } from '@/Hooks/UsePost';
import { useChangeState } from '@/Hooks/useChangeState';
import { useGet } from '@/Hooks/UseGet';
import FullPageLoader from '@/components/Loading';

const AddCity = ({ lang = 'en' }) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchCountry, loading: loadingCountry, data: dataCountry } = useGet({ url: `${apiUrl}/admin/getCountries` });
    const { postData, loadingPost, response: postResponse } = usePost({ url: `${apiUrl}/admin/addCity` });
    const { changeState, loadingChange, responseChange } = useChangeState();

    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const initialItemData = state?.itemData || null;
    const [countries, setCountries] = useState([]);

    // Determine if we're in "edit" mode based on whether itemData is provided
    const isEditMode = !!initialItemData;
    const title = isEditMode ? 'Edit City' : 'Add City';

    useEffect(() => {
        refetchCountry();
    }, [refetchCountry]);

    useEffect(() => {
        if (dataCountry && dataCountry.countries) {
            const formatted = dataCountry.countries.map((u) => ({
                label: u.name || "—",
                value: u.id.toString() || "", // Ensure ID is a string
            }));
            console.log("Formatted countries:", formatted);
            setCountries(formatted);
        }
    }, [dataCountry]);

    // Define the fields for the form
    const fields = [
        { name: 'city', type: 'input', placeholder: 'City Name' },
        {
            name: 'country', // Field name for the select input
            type: 'select',
            placeholder: 'Choose the country',
            options: countries,
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

    // State to manage form values
    const [values, setValues] = useState({});

    // Set initial values when itemData is provided
    useEffect(() => {
        if (initialItemData) {
            console.log("initialItemData:", initialItemData);
            setValues({
                id: initialItemData.id || '',
                city: initialItemData.city || '',
                country: initialItemData.country?.toString() || '', // Use country_id
                status: initialItemData.status  === "Active" ? "active" : "inactive" ,
            });
        }
    }, [initialItemData]);

    const handleChange = (lang, name, value) => {
        // Fallback: Map country name to ID if Combobox sends label
        let newValue = value;
        if (name === 'country' && value) {
            const selectedCountry = countries.find((c) => c.label === value);
            newValue = selectedCountry ? selectedCountry.value : value;
        }
        console.log(`handleChange: ${name} =`, newValue);
        setValues((prev) => ({ ...prev, [name]: newValue }));
    };

    const handleSubmit = async () => {
        console.log("Submitting values:", values);
        if (isEditMode) {
            // Edit mode: Use changeState (PUT request)
            const data = {
                id: values.id || "",
                name: values.city || "",
                country_id: values.country || "", // Use values.country as country_id
                status: values.status === "Active" ? "active" : "inactive",
            };
            console.log("Edit payload:", data);
            await changeState(
                `${apiUrl}/admin/editCity/${values.id}`,
                "City Updated Successfully!",
                data
            );
        } else {
            // Add mode: Use postData (POST request)
            const body = new FormData();
            body.append("name", values.city || "");
            body.append("country_id", values.country || "");
            body.append("status", values.status);
            console.log("FormData:", [...body]);
            await postData(body, "City Added Successfully!");
        }
    };

    const handleReset = () => {
        setValues(initialItemData ? {
            id: initialItemData.id || '',
            city: initialItemData.city || '',
            country: initialItemData.country_id?.toString() || '', // Reset with country_id
            status: initialItemData.status  === "Active" ? "active" : "inactive",
        } : {});
    };

    useEffect(() => {
        if ((!loadingChange && responseChange) || (!loadingPost && postResponse)) {
            navigate(-1);
        }
    }, [responseChange, postResponse]);

    const handleBack = () => {
        navigate(-1);
    };

    if(loadingCountry){
        return <FullPageLoader/>
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

export default AddCity;