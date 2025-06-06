import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash, Plus, Eye, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import clsx from "clsx";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Main style file
import 'react-date-range/dist/theme/default.css'; // Theme CSS file
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslation } from 'react-i18next';
export default function DataTable({
  data,
  columns,
  addRoute,
  onEdit,
  onDelete,
  onToggleStatus,
  showAddButton = true,
  showActionColumns = true,
  detailsData,
  pageDetailsRoute,
  pageDetailsLabel,
  statusLabels = { active: "Active", inactive: "Inactive" },
  statusLabelsText = { active: "Active", inactive: "Inactive" },
  additionalLink, additionalLinkLabel,
  dateRangeFilter = false,
  dateRangeKey = 'created_at', // default key to filter by
  onDateRangeChange // callback for parent component
}) {
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Set default for pageDetailsLabel if not provided
  if (pageDetailsLabel === undefined) {
    pageDetailsLabel = t("ViewDetails");
  }

  const [showDatePicker, setShowDatePicker] = useState(false);

  // Date range state
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const filteredData = useMemo(() => {
    let result = data.filter((row) => {
      const matchesSearch = row.name
        ?.toLowerCase()
        .includes(searchValue.toLowerCase());
      const matchesFilter =
        !filterValue || row.status?.toLowerCase() === filterValue.toLowerCase();

      return matchesSearch && matchesFilter;
    });

    if (dateRangeFilter) {
      result = result.filter((row) => {
        if (!row[dateRangeKey]) return false;

        try {
          const rowDate = new Date(row[dateRangeKey]);
          if (isNaN(rowDate.getTime())) return false;
          const startDate = dateRange[0].startDate;
          const endDate = new Date(dateRange[0].endDate);
          endDate.setHours(23, 59, 59, 999); // Include full end day

          return rowDate >= startDate && rowDate <= endDate;
        } catch {
          return false;
        }
      });
    }


    return result;
  }, [data, searchValue, filterValue, dateRange, dateRangeFilter, dateRangeKey]);

  useEffect(() => {
    if (dateRangeFilter && onDateRangeChange) {
      onDateRangeChange({
        startDate: dateRange[0].startDate,
        endDate: dateRange[0].endDate,
      });
    }
  }, [dateRange, dateRangeFilter, onDateRangeChange]);


  const handleViewDetails = (row) => {
    const fullDetails = detailsData?.find((item) => item.id === row.id) || row;
    setSelectedRowData(fullDetails);
    setIsModalOpen(true);
  };

  const renderCellContent = (row, col) => {
    if (col.render) {
      return col.render(row);
    }
    if (col.key === "status") {
      const isActive = row.status?.toLowerCase() === "active";
      return (
        <div className="flex items-center gap-1">
          <Switch
            checked={isActive}
            onCheckedChange={(checked) =>
              onToggleStatus?.(row, checked ? 1 : 0)
            }
            className={clsx(
              "h-5 w-9 rounded-full transition-colors focus:outline-none",
              isActive ? "bg-bg-primary" : "bg-gray-300"
            )}
          >
            <span
              className={clsx(
                "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200",
                isActive ? "translate-x-4" : "translate-x-1"
              )}
            />
          </Switch>
          <span
            className={clsx(
              "text-xs !px-1 !py-0.5 rounded-full",
              isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
            )}
          >
            {isActive ? statusLabels.active : statusLabels.inactive}
          </span>
        </div>
      );
    }
    if (col.key === "statusText") {
      const isActive = row.status?.toLowerCase() === "active";
      return (
        <span
          className={`inline-flex items-center !px-3 !py-1 rounded-full text-xs font-medium ${isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
        >
          {isActive ? statusLabelsText.active : statusLabelsText.inactive}

        </span>
      );
    }
    if (col.key === "rate") {
      const rate = Math.min(5, Math.max(0, parseFloat(row[col.key]) || 0));
      const fullStars = Math.floor(rate);
      const hasHalfStar = rate % 1 >= 0.5;

      return (
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => {
            if (i < fullStars) {
              return (
                <svg
                  key={i}
                  className="w-4 h-4 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              );
            } else if (i === fullStars && hasHalfStar) {
              return (
                <svg
                  key={i}
                  className="w-4 h-4 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <defs>
                    <linearGradient id="half-star" x1="0" x2="100%" y1="0" y2="0">
                      <stop offset="50%" stopColor="currentColor" />
                      <stop offset="50%" stopColor="#D1D5DB" />
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#half-star)"
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              );
            } else {
              return (
                <svg
                  key={i}
                  className="w-4 h-4 text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              );
            }
          })}
          <span className="ml-1 text-sm font-medium text-gray-700">
            {rate.toFixed(1)}
          </span>
        </div>
      );
    }
    if (col.key === "map") {
      const url = row[col.key];
      const displayText = url.length > 20 ? `${url.substring(0, 10)}...${url.substring(url.length - 10)}` : url;
      return (
        <div className="w-[120px] truncate">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {displayText}
          </a>
          {url.length > 20 && (
            <div className="absolute z-10 hidden group-hover:block bg-gray-800 text-white text-xs !p-2 rounded whitespace-pre-wrap max-w-xs break-words">
              {url}
            </div>
          )}
        </div>
      );
    }
    return row[col.key];
  };

  const renderNestedObject = (obj, prefix = "", depth = 0) => {
    if (!obj || typeof obj !== "object") return null;

    return Object.entries(obj).map(([key, value]) => {
      const isObject = value && typeof value === "object";
      const isArray = Array.isArray(value);
      const isEmpty = isObject && Object.keys(value).length === 0;
      const displayKey = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

      if (isObject) {
        return (
          <div key={`${prefix}${key}`} className={`mt-2 ${depth > 0 ? "ml-1" : ""}`}>
            <div className={`pl-4 ${depth === 0 ? "border-l-2 border-gray-200" : "border-l border-gray-100"}`}>
              {renderNestedObject(value, `${prefix}${key}.`, depth + 1)}
            </div>
          </div>
        );
      }

      return (
        <div key={`${prefix}${key}`} className={`grid grid-cols-2 gap-4 py-1 ${depth > 0 ? "pl-2" : ""}`}>
          <span className="font-medium text-gray-600 break-words">{displayKey}</span>
          <span className="break-words">
            {value?.toString() || <span className="text-gray-400 italic">—</span>}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="w-full !p-3 !space-y-6">
      <div className="flex justify-between !mb-6 items-center flex-wrap gap-4">

        <Input
          placeholder="Search..."
          className="w-full md:!ms-3 sm:!ms-0 !p-2 sm:w-1/3 max-w-sm border-bg-primary focus:border-bg-primary focus:ring-bg-primary rounded-[10px]"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div className="flex items-center gap-3">

          {dateRangeFilter && (
            <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
              <PopoverTrigger className="border-bg-primary" asChild>
                <Button variant="outline" className="flex items-center gap-4 !p-4">
                  <Calendar className="h-4 w-4" />
                  {format(dateRange[0].startDate, "MMM dd, yyyy")} -{" "}
                  {format(dateRange[0].endDate, "MMM dd, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => setDateRange([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={dateRange}
                  className="border-0"
                />
                <div className="flex justify-end p-2 border-t">
                  <Button size="sm" onClick={() => setShowDatePicker(false)}>
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <Select value={filterValue} onValueChange={setFilterValue}>
              <SelectTrigger className="w-[120px] border-bg-primary focus:ring-bg-primary rounded-[10px] !px-2">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent className="bg-white border-bg-primary rounded-md shadow-lg !p-3">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {showAddButton && (
              <Button
                onClick={() => navigate(addRoute)}
                className="bg-bg-primary cursor-pointer text-white hover:bg-teal-700 rounded-[10px] !p-3"
              >
                <Plus className="w-5 h-5 !mr-2" />
                Add
              </Button>
            )}
            {additionalLink && (
              <Button
                onClick={() => navigate(additionalLink)}
                className="bg-bg-primary cursor-pointer text-white hover:bg-teal-700 rounded-[10px] !p-3"
              >
                {additionalLinkLabel}
              </Button>
            )
            }
          </div>
        </div>
      </div>

      <div className="overflow-x-auto w-full mx-auto">
        <Table className="!min-w-[600px] table-fixed">
          <TableHeader>
            <TableRow>
              {columns.map((col, index) => (
                <TableHead
                  key={index}
                  className={`text-bg-primary font-semibold ${col.width || "w-auto"}`}
                >
                  {col.label}
                </TableHead>
              ))}
              {(detailsData || pageDetailsRoute) && (
                <TableHead className="text-bg-primary font-semibold w-auto">
                  {detailsData ? "Details" : pageDetailsLabel}
                </TableHead>
              )}
              {showActionColumns && (
                <TableHead className="text-bg-primary font-semibold w-[100px]">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((col, idx) => (
                    <TableCell
                      key={idx}
                      className={`text-sm !py-3 !px-1 whitespace-normal break-words ${col.width || "w-auto"} truncate`}
                    >
                      {renderCellContent(row, col)}
                    </TableCell>
                  ))}
                  {detailsData && (
                    <TableCell className="text-sm !py-3 !px-1 w-[100px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(row)}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        View Details
                      </Button>
                    </TableCell>
                  )}
                  {pageDetailsRoute && (
                    <TableCell className="text-sm !py-3 !px-1 w-[100px]">
                      <Link
                        to={`details/${row.id}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {pageDetailsLabel}
                      </Link>
                    </TableCell>
                  )}
                  {showActionColumns && (
                    <TableCell className="w-[100px]">
                      <div className="flex gap-2">
                        {
                          onEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                console.log("Edit clicked for row:", row);
                                onEdit?.(row);
                              }}
                            >
                              <Edit className="w-4 h-4 text-bg-primary" />
                            </Button>
                          )
                        }
                        {
                          onDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDelete?.(row)}
                            >
                              <Trash className="w-4 h-4 text-red-600" />
                            </Button>
                          )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (detailsData || pageDetailsRoute ? 2 : 1)}
                  className="text-center text-gray-500 py-4"
                >
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="sm:max-w-[650px] !p-6 max-h-[85vh] overflow-y-auto rounded-lg shadow-xl"
          style={{
            backgroundColor: "white",
            border: "none",
            padding: "0",
          }}
        >
          <DialogHeader>
            <DialogTitle>Details</DialogTitle>
          </DialogHeader>
          {detailsData && (
            <div className="grid grid-cols-2 gap-4 !py-4">
              {renderNestedObject(detailsData)}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="w-full !mb-10 max-w-[1200px] mx-auto">
        <Pagination className="!mb-2 flex justify-center items-center m-auto">
          <PaginationContent className="text-bg-primary font-semibold flex gap-2">
            <PaginationItem>
              <PaginationPrevious href="#" className="text-bg-primary" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                className="border border-gray-400 hover:bg-gray-200 transition-all px-3 py-1 rounded-lg text-bg-primary"
                href="#"
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis className="text-bg-primary" />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" className="text-bg-primary" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
