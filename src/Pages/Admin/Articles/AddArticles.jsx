import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Add from '@/components/AddFieldSection';
import { ArrowLeft } from 'lucide-react';
import { usePost } from '@/Hooks/UsePost';
import { useChangeState } from '@/Hooks/useChangeState';
import { useGet } from '@/Hooks/UseGet';
import { toast } from 'react-toastify';
import FullPageLoader from '@/components/Loading';

const AddArticles = ({ lang = 'en' }) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { postData, loadingPost, response: postResponse } = usePost({ url: `${apiUrl}/admin/create-article` });
    const { changeState, loadingChange, responseChange } = useChangeState();

    const [imageChanged, setImageChanged] = useState(false); // Track if image has been changed

    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const initialItemData = state?.companyDetails || null;

    const isEditMode = !!initialItemData;
    const title = isEditMode ? 'Edit Article' : 'Add Article';

    // Initialize values state with default empty values
    const [values, setValues] = useState({
        id: '',
        title: '',
        body: '',
        img: '',
    });

    useEffect(() => {
        if (initialItemData) {
            setValues({
                id: initialItemData.id || '',
                title: initialItemData.title || '',
                body: initialItemData.body || '',
                img: initialItemData.img || '',
            });
        }
    }, [initialItemData]);

    const handleChange = (lang, name, value) => {
        if (name === 'img') {
            setImageChanged(true); // Mark image as changed
        }
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (isEditMode) {
            const data = {
                id: values.id,
                title: values.title,
                body: values.body,
                image: values.img,
            };

            // Only include img if it has been changed
            if (imageChanged && values.img) {
                data.img = values.img;
            }

            await changeState(
                `${apiUrl}/admin/edit-article/${values.id}`,
                'Article Updated Successfully!',
                data
            );
        } else {
            const body = new FormData();
            body.append('title', values.title || '');
            body.append('body', values.body || '');
            body.append('image', values.img || '');
            if (imageChanged && values.img && typeof values.img !== 'string') {
                body.append('image', values.img);
            }
            await postData(body, 'Article Added Successfully!');
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
                    title: initialItemData.title || '',
                    body: initialItemData.body || '',
                    img: initialItemData.img || '',
                } : {
                    id: '',
                    title: '',
                    body: '',
                    img: '',
                });
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (loadingPost || loadingChange) {
        return <FullPageLoader />;
    }

    const fields = [
        { name: 'title', type: 'input', placeholder: 'Article Title *' },
        { name: 'body', type: 'textarea', rows: 5, placeholder: 'Article Body *' },
        { name: 'img', type: 'file', placeholder: 'Article Image *' },
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

export default AddArticles;