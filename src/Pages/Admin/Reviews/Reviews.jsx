import React, { useState, useEffect } from "react";
import { useGet } from '@/Hooks/UseGet';
import FullPageLoader from "@/components/Loading";
import { useChangeState } from "@/Hooks/useChangeState";
import { toast } from "react-toastify";
import { FaStar, FaRegStar, FaToggleOn, FaToggleOff, FaUserCircle } from "react-icons/fa";

const Reviews = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchReview, loading: loadingReview, data: dataReview } = useGet({ url: `${apiUrl}/admin/get-reviews` });
    const { changeState, loadingChange } = useChangeState();
    const [ReviewList, setReviewList] = useState([]);
    const [activeTab, setActiveTab] = useState("all"); // "all", "public", "private"

    useEffect(() => {
        refetchReview();
    }, [refetchReview]);

    useEffect(() => {
        if (dataReview?.reviews) {
            setReviewList(dataReview.reviews);
        }
    }, [dataReview]);

    const filteredReviews = ReviewList.filter(review => {
        if (activeTab === "all") return true;
        return review.status === activeTab;
    });

    const toggleReviewStatus = async (reviewId, currentStatus) => {
        const newStatus = currentStatus === "public" ? "private" : "public";
        const success = await changeState(
            `${apiUrl}/admin/edit-review/${reviewId}`,
            `Review is now ${newStatus}`,
            { status: newStatus }
        );

        if (success) {
            setReviewList(prev => prev.map(review =>
                review.id === reviewId ? { ...review, status: newStatus } : review
            ));
        }
    };

    const renderStars = (rating) => {
        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    i < rating ?
                        <FaStar key={i} className="text-yellow-400" /> :
                        <FaRegStar key={i} className="text-yellow-400" />
                ))}
            </div>
        );
    };

    const statusBadge = (status) => {
        const statusMap = {
            public: { color: "bg-green-100 text-green-800", icon: <FaToggleOn className="text-green-500" /> },
            private: { color: "bg-gray-100 text-gray-800", icon: <FaToggleOff className="text-gray-500" /> }
        };

        return (
            <div className="flex items-center gap-1">
                {statusMap[status]?.icon}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusMap[status]?.color}`}>
                    {status}
                </span>
            </div>
        );
    };

    if (loadingReview) {
        return <FullPageLoader />
    }

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl text-bg-primary font-bold mb-2">Reviews Management</h1>
                    <p className="text-gray-600">Toggle reviews between public and private visibility</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
                    {["all", "public", "private"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${activeTab === tab
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Reviews List */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {filteredReviews.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No {activeTab === "all" ? "" : activeTab} reviews found
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {filteredReviews.map(review => (
                                <li key={review.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                        {/* User Avatar */}
                                        <div className="flex-shrink-0">
                                            {review.user.image_link ? (
                                                <img
                                                    src={review.user.image_link}
                                                    alt={review.user.full_name}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <FaUserCircle className="text-gray-400 text-5xl" />
                                            )}
                                        </div>

                                        {/* Review Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                                <h3 className="font-medium text-gray-900">
                                                    {review.user.full_name || `${review.user.first_name} ${review.user.last_name}`}
                                                </h3>
                                                <div className="flex items-center gap-3">
                                                    {renderStars(review.rate)}
                                                    {statusBadge(review.status)}
                                                </div>
                                            </div>

                                            <p className="text-gray-700 mb-4 italic">"{review.comment}"</p>

                                            {/* Toggle Button */}
                                            <button
                                                onClick={() => toggleReviewStatus(review.id, review.status)}
                                                disabled={loadingChange}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${review.status === "public"
                                                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                        : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                                                    }`}
                                            >
                                                {review.status === "public" ? (
                                                    <>
                                                        <FaToggleOff />
                                                        <span>Make Private</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaToggleOn />
                                                        <span>Make Public</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reviews;