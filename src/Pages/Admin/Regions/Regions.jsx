import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGet } from '@/Hooks/UseGet';
import { useDelete } from '@/Hooks/useDelete';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeleteDialog from '@/components/DeleteDialog'; // Import DeleteDialog
import FullPageLoader from "@/components/Loading";

const Regions = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchCountry, loading: loadingCountry, data: dataCountry } = useGet({ url: `${apiUrl}/admin/getCountries` });
    const { refetch: refetchCity, loading: loadingCity, data: dataCity } = useGet({ url: `${apiUrl}/admin/getCities` });
    const { refetch: refetchZone, loading: loadingZone, data: dataZone } = useGet({ url: `${apiUrl}/admin/getZones` });
    const { deleteData, loadingDelete } = useDelete();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [zones, setZones] = useState([]);
    const [activeTab, setActiveTab] = useState("countries");

    const navigate = useNavigate();

    useEffect(() => {
        refetchCountry();
        refetchCity();
        refetchZone();
    }, [refetchCountry, refetchCity, refetchZone]);

    useEffect(() => {
        if (dataCountry && dataCountry.countries) {
            const formatted = dataCountry?.countries?.map((u) => ({
                id: u.id,
                country: u.name || "—",
                status: u.status === "active" ? "Active" : "Inactive",
            }));
            setCountries(formatted);
        }
    }, [dataCountry]);

    useEffect(() => {
        if (dataCity && dataCity.cities) {
            const formatted = dataCity?.cities?.map((u) => ({
                id: u.id,
                city: u.name || "—",
                country: u.country?.id || '',
                countryName: u.country?.name || '',
                status: u.status === "active" ? "Active" : "Inactive",
            }));
            setCities(formatted);
        }
    }, [dataCity]);

    useEffect(() => {
        if (dataZone && dataZone.zones) {
            const formatted = dataZone?.zones?.map((u) => ({
                id: u.id,
                zone: u.name || "—",
                city: u.city?.id || '',
                cityName: u.city?.name || '',
                countryName: u.city.country?.name || '',
                status: u.status === "active" ? "Active" : "Inactive",
            }));
            setZones(formatted);
        }
    }, [dataZone]);

    const countryColumns = [
        { key: "country", label: "Country" },
        { key: "status", label: "Status" },
    ];

    const cityColumns = [
        { key: "city", label: "City" },
        { key: "countryName", label: "Country" },
        { key: "status", label: "Status" },
    ];

    const zoneColumns = [
        { key: "zone", label: "Zone" },
        { key: "cityName", label: "City" },
        { key: "countryName", label: "Country" },
        { key: "status", label: "Status" },
    ];

    const handleView = (item) => console.log("View:", item);
    const handleEdit = (item) => navigate(`add_${item.type}`, { state: { itemData: item } });

    const handleDelete = (item) => {
        setSelectedRow(item);
        setIsDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedRow) return;

        let deleteUrl;
        let successMessage;
        let updateState;

        switch (activeTab) {
            case "countries":
                deleteUrl = `${apiUrl}/admin/deleteCountry/${selectedRow.id}`;
                successMessage = `${selectedRow.country} Deleted Successfully.`;
                updateState = setCountries;
                break;
            case "cities":
                deleteUrl = `${apiUrl}/admin/deleteCity/${selectedRow.id}`;
                successMessage = `${selectedRow.city} Deleted Successfully.`;
                updateState = setCities;
                break;
            case "zones":
                deleteUrl = `${apiUrl}/admin/deleteZone/${selectedRow.id}`;
                successMessage = `${selectedRow.zone} Deleted Successfully.`;
                updateState = setZones;
                break;
            default:
                return;
        }

        const success = await deleteData(deleteUrl, successMessage);
        if (success) {
            setIsDeleteOpen(false);
            updateState((prev) => prev.filter((item) => item.id !== selectedRow.id));
            setSelectedRow(null);
        }
    };

    const getAddLink = () => {
        switch (activeTab) {
            case "countries":
                return "add_country";
            case "cities":
                return "add_city";
            case "zones":
                return "add_zone";
            default:
                return "add_region";
        }
    };

    const getAddText = () => {
        switch (activeTab) {
            case "countries":
                return "Country";
            case "cities":
                return "City";
            case "zones":
                return "Zone";
            default:
                return "Region";
        }
    };

    const getTitleText = () => {
        switch (activeTab) {
            case "countries":
                return "Country Management";
            case "cities":
                return "City Management";
            case "zones":
                return "Zone Management";
            default:
                return "Region Management";
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl text-bg-primary font-bold">{getTitleText()}</h2>
                <Link
                    to={getAddLink()}
                    className="flex justify-center items-center px-4 py-1 rounded-md text-base bg-bg-secondary font-semibold text-white hover:bg-bg-secondary/90"
                >
                    <Plus className="mr-2 h-4 w-4 text-white" /> Add {getAddText()}
                </Link>
            </div>
            <Tabs defaultValue="countries" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger className="p-3 font-semibold text-base" value="countries">Countries</TabsTrigger>
                    <TabsTrigger className="p-3 font-semibold text-base" value="cities">Cities</TabsTrigger>
                    <TabsTrigger className="p-3 font-semibold text-base" value="zones">Zones</TabsTrigger>
                </TabsList>
                <TabsContent value="countries">
                    {loadingCountry ? (
                        <FullPageLoader />
                    ) : (
                        <Table
                            data={countries}
                            columns={countryColumns}
                            statusKey="status"
                            filterKeys={["country"]}
                            titles={{ country: "Country" }}
                            onEdit={(item) => handleEdit({ ...item, type: 'country' })}
                            onDelete={handleDelete}
                            className="w-full bg-white rounded-lg shadow-md p-6"
                        />
                    )}
                </TabsContent>
                <TabsContent value="cities">
                    {loadingCity ? (
                        <FullPageLoader />
                    ) : (
                        <Table
                            data={cities}
                            columns={cityColumns}
                            statusKey="status"
                            filterKeys={["city"]}
                            titles={{ city: "City" }}
                            onEdit={(item) => handleEdit({ ...item, type: 'city' })}
                            onDelete={handleDelete}
                            className="w-full bg-white rounded-lg shadow-md p-6"
                        />
                    )}
                </TabsContent>
                <TabsContent value="zones">
                    {loadingZone ? (
                        <div>Loading zones...</div>
                    ) : (
                        <Table
                            data={zones}
                            columns={zoneColumns}
                            statusKey="status"
                            filterKeys={["zone"]}
                            titles={{ city: "Zone" }}
                            onEdit={(item) => handleEdit({ ...item, type: 'zone' })}
                            onDelete={handleDelete}
                            className="w-full bg-white rounded-lg shadow-md p-6"
                        />
                    )}
                </TabsContent>
            </Tabs>
            <DeleteDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onDelete={handleDeleteConfirm}
                name={selectedRow?.[activeTab === "countries" ? "country" : activeTab === "cities" ? "city" : "zone"]}
                isLoading={loadingDelete}
            />
        </div>
    );
};

export default Regions;