import React, { useState, useEffect } from "react";
import { useGet } from '@/Hooks/UseGet';
import FullPageLoader from "@/components/Loading";
import {
    FiDownload,
    FiSearch,
    FiUser,
    FiFileText,
    FiMapPin,
    FiMail,
    FiPhone,
    FiCalendar
} from "react-icons/fi";
import {
    FaSortAmountDownAlt,
    FaSortAmountUp,
    FaFileDownload,
    FaMapMarkerAlt
} from "react-icons/fa";

const AllCV = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchCV, loading: loadingCV, data: dataCV } = useGet({ url: `${apiUrl}/admin/get-allcvs` });
    const [cvList, setCvList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "created_at", direction: "desc" });

    useEffect(() => {
        refetchCV();
    }, [refetchCV]);

    useEffect(() => {
        if (dataCV?.cvs) {
            setCvList(dataCV.cvs);
        }
    }, [dataCV]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedAndFilteredCVs = React.useMemo(() => {
        let filtered = [...cvList];

        if (searchTerm) {
            filtered = filtered.filter(cv =>
                cv.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cv.user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cv.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (cv.user_address && cv.user_address.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                // Handle nested user properties
                const aValue = sortConfig.key.includes('.')
                    ? sortConfig.key.split('.').reduce((o, i) => o[i], a)
                    : a[sortConfig.key];
                const bValue = sortConfig.key.includes('.')
                    ? sortConfig.key.split('.').reduce((o, i) => o[i], b)
                    : b[sortConfig.key];

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return filtered;
    }, [cvList, searchTerm, sortConfig]);

    if (loadingCV) {
        return <FullPageLoader />
    }

    return (
        <div className="min-h-screen p-4 md:p-6 bg-gray-50">
            <div className="w-full">
                <div className="mb-4">
                    <h1 className="text-3xl text-bg-primary font-bold mb-2">CV Management</h1>
                    <p className="text-gray-600">Browse and manage candidate CVs</p>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-lg shadow p-4 mb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search candidates..."
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Sort by:</span>
                            <button
                                onClick={() => requestSort("created_at")}
                                className={`px-3 py-1 rounded-lg text-sm flex items-center ${sortConfig.key === "created_at" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}
                            >
                                Date
                                {sortConfig.key === "created_at" && (
                                    sortConfig.direction === "asc" ?
                                        <FaSortAmountDownAlt className="ml-1" /> :
                                        <FaSortAmountUp className="ml-1" />
                                )}
                            </button>
                            <button
                                onClick={() => requestSort("user.first_name")}
                                className={`px-3 py-1 rounded-lg text-sm flex items-center ${sortConfig.key === "user.first_name" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}
                            >
                                Name
                                {sortConfig.key === "user.first_name" && (
                                    sortConfig.direction === "asc" ?
                                        <FaSortAmountDownAlt className="ml-1" /> :
                                        <FaSortAmountUp className="ml-1" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                {sortedAndFilteredCVs.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
                        <div className="bg-white p-5 rounded-lg shadow">
                            <h3 className="text-lg font-medium text-gray-700 mb-2">Total CVs</h3>
                            <p className="text-3xl font-bold text-blue-600">{sortedAndFilteredCVs.length}</p>
                        </div>
                        <div className="bg-white p-5 rounded-lg shadow">
                            <h3 className="text-lg font-medium text-gray-700 mb-2">New This Week</h3>
                            <p className="text-3xl font-bold text-green-600">
                                {sortedAndFilteredCVs.filter(cv => {
                                    const cvDate = new Date(cv.created_at);
                                    const oneWeekAgo = new Date();
                                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                                    return cvDate > oneWeekAgo;
                                }).length}
                            </p>
                        </div>
                        <div className="bg-white p-5 rounded-lg shadow">
                            <h3 className="text-lg font-medium text-gray-700 mb-2">Recently Updated</h3>
                            <p className="text-3xl font-bold text-purple-600">
                                {sortedAndFilteredCVs.filter(cv => {
                                    const updateDate = new Date(cv.updated_at);
                                    const threeDaysAgo = new Date();
                                    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
                                    return updateDate > threeDaysAgo && cv.updated_at !== cv.created_at;
                                }).length}
                            </p>
                        </div>
                    </div>
                )}

                {/* CV Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedAndFilteredCVs.length > 0 ? (
                        sortedAndFilteredCVs.map((cv) => (
                            <div
                                key={cv.id}
                                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col max-w-full overflow-hidden min-w-0"
                            >
                                {/* User Info Header */}
                                <div className="flex items-center mb-4">
                                    {cv.user.image_link ? (
                                        <img
                                            src={cv.user.image_link}
                                            alt={`${cv.user.first_name}'s profile`}
                                            className="w-12 h-12 rounded-full object-cover mr-4 max-w-full"
                                            onError={(e) => (e.target.src = '/fallback-image.png')}
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                            <FiUser className="text-blue-600 text-xl" />
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <h2 className="text-xl font-semibold text-gray-800 truncate">
                                            {cv.user.first_name} {cv.user.last_name}
                                        </h2>
                                        <a 
                                            href={`mailto:${cv.user.email}`}
                                            className="text-sm text-blue-500 hover:text-blue-700 truncate block"
                                        >
                                            {cv.user.email}
                                        </a>
                                    </div>
                                </div>

                                {/* User Details */}
                                <div className="flex-1 space-y-3 mb-4">
                                    {/* Country and City Information */}
                                    <div className="flex items-center text-gray-600 truncate">
                                        <FaMapMarkerAlt className="mr-2 text-blue-500" />
                                        <span>
                                            {cv.user.country ? cv.user.country.name : 'Country not specified'}
                                            {cv.user.city && cv.user.country ? ', ' : ''}
                                            {cv.user.city ? cv.user.city.name : ''}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center text-gray-600 truncate">
                                        <FiPhone className="mr-2 text-blue-500" />
                                        <span>{cv.user.phone || 'Phone not provided'}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <FiCalendar className="mr-2 text-blue-500" />
                                        <span>Age: {cv.user.age || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <FiFileText className="mr-2 text-blue-500" />
                                        <span>Uploaded: {new Date(cv.created_at).toLocaleDateString()}</span>
                                    </div>
                                    {cv.updated_at !== cv.created_at && (
                                        <div className="flex items-center text-gray-600 text-sm">
                                            <FiFileText className="mr-2 text-blue-500" />
                                            <span>Updated: {new Date(cv.updated_at).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-auto flex space-x-2">
                                    <a
                                        href={cv.cv_file_url}
                                        download
                                        className="flex-1 inline-flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        <FaFileDownload className="mr-2" />
                                        Download CV
                                    </a>
                                    <a
                                        href={`mailto:${cv.user.email}`}
                                        className="inline-flex items-center justify-center bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors duration-200"
                                    >
                                        <FiMail className="mr-2" />
                                        Email
                                    </a>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-lg shadow">
                            {searchTerm ? "No matching CVs found" : "No CVs available"}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AllCV;