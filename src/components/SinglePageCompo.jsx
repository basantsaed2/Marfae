import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  FileText,
  Home,
  Users,
  Phone,
  Calendar,
  Globe,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import VilliageAdmin from "@/Pages/Villiage/VilliageAdmins/VilliageAdmin";
import VillageGallery from "@/Pages/Villiage/VillageGallery";
// import Units from "@/Pages/Villages/Units";
// import Gallery from "./Gallery";


export default function VillageDetailsCard({
  data,
  status = "Active",
  entityType,
}) {
  const location = useLocation();
  if (!data) return null;

  const formatDate = (dateString) => {
    // Example implementation - adjust based on your needs
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  return (
    <div className="w-full">
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="w-full grid grid-cols-4 gap-2 md:gap-6 bg-transparent !my-6">
          <TabsTrigger
            className="rounded-[10px] text-md md:text-lg border text-bg-primary !py-3 transition-all
                  data-[state=active]:bg-bg-primary data-[state=active]:text-white
                  hover:bg-teal-100 hover:text-teal-700"
            value="info"
          >
            Infomation
          </TabsTrigger>
          <TabsTrigger
            className="rounded-[10px] text-md md:text-lg border text-bg-primary !py-3 transition-all
                  data-[state=active]:bg-bg-primary data-[state=active]:text-white
                  hover:bg-teal-100 hover:text-teal-700"
            value="admin"
          >
            Admins
          </TabsTrigger>
          <TabsTrigger
            className="rounded-[10px] text-md md:text-lg border text-bg-primary !py-3 transition-all
                  data-[state=active]:bg-bg-primary data-[state=active]:text-white
                  hover:bg-teal-100 hover:text-teal-700"
            value="gallery"
          >
            Gallery
          </TabsTrigger>

          {/* Conditionally render the "Units" tab */}
          {entityType === "village" && (
            <TabsTrigger
              className="rounded-[10px] text-md md:text-lg border text-bg-primary !py-3 transition-all
                    data-[state=active]:bg-bg-primary data-[state=active]:text-white
                    hover:bg-teal-100 hover:text-teal-700"
              value="units"
            >
              Units
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="info">
          <Card className="!p-8 bg-gradient-to-br from-[#f3fbfa] to-white w-full shadow-lg border-none rounded-2xl transition-all duration-300 hover:shadow-xl">
            <CardContent className="flex flex-col gap-6">
              {/* Header Section */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  {data.image && (
                    <img
                      src={data.image}
                      alt="Village"
                      className="w-20 h-20 rounded-full object-cover border-2 border-[#297878] transition-transform duration-300 hover:scale-105"
                    />
                  )}
                  <h3 className="text-xl font-bold text-bg-primary tracking-tight">
                    {data.name}
                  </h3>
                </div>
                <Badge
                  variant="outline"
                  className={`!px-5 !py-2 text-sm font-medium cursor-pointer rounded-full transition-colors duration-200 ${status === "Active"
                      ? "bg-green-100 hover:bg-green-200 text-green-800"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                    }`}
                >
                  {status}
                </Badge>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 gap-4 text-sm text-bg-primary">
                {[
                  { field: 'location', icon: MapPin, label: 'Location' },
                  { field: 'description', icon: FileText, label: 'Description' },
                  { field: 'units', icon: Home, label: 'Units' },
                  { field: 'population', icon: Users, label: 'Population' },
                  { field: 'zone', icon: Globe, label: 'Zone' },
                  { field: 'village', icon: MapPin, label: 'Village' },
                  { field: 'phone', icon: Phone, label: 'Phone' },
                ].map(({ field, icon: Icon, label }) => (
                  data[field] && (
                    <div
                      key={field}
                      className="flex items-center gap-3 !p-1 rounded-lg hover:bg-[#e6f0ef] transition-colors duration-200"
                    >
                      <Icon className="w-5 h-5 text-[#297878] flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-[#297878]">{label}:</span>
                        <span className="!ml-2 text-gray-800">{data[field]}</span>
                      </div>
                    </div>
                  )
                ))}

                {/* Date Range Section */}
                {(data.from || data.to) && (
                  <div className="flex items-center gap-3 !p-1 rounded-lg hover:bg-[#e6f0ef] transition-colors duration-200">
                    <Calendar className="w-5 h-5 text-[#297878] flex-shrink-0" />
                    <div className="flex items-center gap-2">
                      {data.from && (
                        <span className="flex items-center">
                          <span className="font-semibold text-[#297878]">From:</span>
                          <span className="!ml-2 text-gray-800">{formatDate(data.from)}</span>
                        </span>
                      )}
                      {data.from && data.to && (
                        <span className="text-gray-500 !mx-2">→</span>
                      )}
                      {data.to && (
                        <span className="flex items-center">
                          <span className="font-semibold text-[#297878]">To:</span>
                          <span className="!ml-2 text-gray-800">{formatDate(data.to)}</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="admin">
          {<VilliageAdmin />}
        </TabsContent>
        <TabsContent value="gallery">
          <VillageGallery />
        </TabsContent>
        {/* <TabsContent value="units">
          <Units />
        </TabsContent> */}
      </Tabs>
    </div>
  );
}