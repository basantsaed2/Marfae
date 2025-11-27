import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Add from '@/components/AddFieldSection';
import { ArrowLeft } from 'lucide-react';
import { usePost } from '@/Hooks/UsePost';
import { useChangeState } from '@/Hooks/useChangeState';
import { useGet } from '@/Hooks/UseGet';
import FullPageLoader from '@/components/Loading';
import { toast } from 'react-toastify';

const AddJobSubTitle = ({ lang = 'en' }) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchTitle, loading: loadingTitle, data: dataTitle } = useGet({ url: `${apiUrl}/admin/getJobTitles` });
    const { postData, loadingPost, response: postResponse } = usePost({ url: `${apiUrl}/admin/add-job-sub-title` });
    const { changeState, loadingChange, responseChange } = useChangeState();

    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const initialItemData = state?.itemData || null;

    const isEditMode = !!initialItemData;
    const title = isEditMode ? 'Edit Job Sub Title' : 'Add Job Sub Title';

    const [values, setValues] = useState({
        sub_title_name: '',
        job_title_id: '',
    });

    const [titles, setTitles] = useState([]);

    useEffect(() => {
        refetchTitle();
    }, [refetchTitle]);

    useEffect(() => {
        if (dataTitle && dataTitle.job_tittles) {
            const formatted = dataTitle.job_tittles.map((u) => ({
                label: u.name || "—",
                value: u.id.toString(),
            }));
            setTitles(formatted);
        }
    }, [dataTitle]);

    const fields = [
        { name: 'sub_title_name', type: 'input', placeholder: 'Job Sub Title Name' },
        {
            name: 'job_title_id',
            type: 'select',
            placeholder: 'Select Job Title *',
            options: titles,
        }

    ];

    useEffect(() => {
        if (initialItemData) {
            setValues({
                id: initialItemData.id || '',
                sub_title_name: initialItemData.sub_title_name || '',
                job_title_id: initialItemData.job_title_id?.toString() || '',
            });
            // setImageChanged(false); // Reset image changed flag when loading initial data
        }
    }, [initialItemData]);

    const handleChange = (lang, name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (
            !values.sub_title_name ||
            !values.job_title_id
        ) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            if (isEditMode) {
                const data = {
                    id: values.id,
                    sub_title_name: values.sub_title_name ,
                    job_title_id: parseInt(values.job_title_id),
                };
                await changeState(
                    `${apiUrl}/admin/edit-job-sub-title/${values.id}`,
                    'Job Sub Title Updated Successfully!',
                    data
                );
            } else {
                const body = new FormData();
                body.append('sub_title_name', values.sub_title_name);
                body.append('job_title_id', values.job_title_id);

                await postData(body, 'Job Sub Title Added Successfully!');
            }
        } catch (error) {
            toast.error('Failed to submit job: ' + error.message);
        }
    };

    useEffect(() => {
        if ((!loadingChange && responseChange?.status === 200) || (!loadingPost && postResponse?.status === 200)) {
            navigate(-1);
        }
    }, [responseChange, postResponse, navigate]);

    const handleReset = () => {
        setValues(initialItemData ? {
            id: initialItemData.id || '',
            sub_title_name: initialItemData.sub_title_name || '',
            job_title_id: initialItemData.job_title_id?.toString() || '',
        } : {
            sub_title_name: '',
            job_title_id: '',
        });
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (loadingTitle) {
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

export default AddJobSubTitle;