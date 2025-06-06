// import * as React from "react"

// import { cn } from "@/lib/utils"

// function Table({
//   className,
//   ...props
// }) {
//   return (
//     <div data-slot="table-container" className="relative w-full overflow-x-auto">
//       <table
//         data-slot="table"
//         className={cn("w-full caption-bottom text-sm", className)}
//         {...props} />
//     </div>
//   );
// }

// function TableHeader({
//   className,
//   ...props
// }) {
//   return (
//     <thead
//       data-slot="table-header"
//       className={cn("[&_tr]:border-b", className)}
//       {...props} />
//   );
// }

// function TableBody({
//   className,
//   ...props
// }) {
//   return (
//     <tbody
//       data-slot="table-body"
//       className={cn("[&_tr:last-child]:border-0", className)}
//       {...props} />
//   );
// }

// function TableFooter({
//   className,
//   ...props
// }) {
//   return (
//     <tfoot
//       data-slot="table-footer"
//       className={cn("bg-muted/50 border-t font-medium [&>tr]:last:border-b-0", className)}
//       {...props} />
//   );
// }

// function TableRow({
//   className,
//   ...props
// }) {
//   return (
//     <tr
//       data-slot="table-row"
//       className={cn(
//         "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
//         className
//       )}
//       {...props} />
//   );
// }

// function TableHead({
//   className,
//   ...props
// }) {
//   return (
//     <th
//       data-slot="table-head"
//       className={cn(
//         "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
//         className
//       )}
//       {...props} />
//   );
// }

// function TableCell({
//   className,
//   ...props
// }) {
//   return (
//     <td
//       data-slot="table-cell"
//       className={cn(
//         "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
//         className
//       )}
//       {...props} />
//   );
// }

// function TableCaption({
//   className,
//   ...props
// }) {
//   return (
//     <caption
//       data-slot="table-caption"
//       className={cn("text-muted-foreground mt-4 text-sm", className)}
//       {...props} />
//   );
// }

// export {
//   Table,
//   TableHeader,
//   TableBody,
//   TableFooter,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableCaption,
// }
// import * as React from "react";
// import { cn } from "@/lib/utils";
// import { Input } from "@/components/ui/input";
// import { Combobox } from "@/components/ui/combobox"; // Use the custom Combobox
// import { Search } from "lucide-react";

// function Table({
//   data,
//   columns,
//   filterKeys,
//   className,
//   onView,
//   onEdit,
//   onDelete,
//   ...props
// }) {
//   const [searchTerm, setSearchTerm] = React.useState("");
//   const [selectedFilters, setSelectedFilters] = React.useState({});

//   const filterValues = React.useMemo(() => {
//     const valuesMap = {};
//     if (data && filterKeys) {
//       filterKeys.forEach((key) => {
//         const title = key === "status" ? "status" : "User specialization";
//         valuesMap[key] = [title, ...new Set(data.map((item) => item[key]))];
//       });
//     }
//     return valuesMap;
//   }, [data, filterKeys]);

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleFilterChange = (key) => (value) => {
//     setSelectedFilters((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//   };

//   const [selectedRows, setSelectedRows] = React.useState([]);

//   const handleRowSelect = (index) => {
//     setSelectedRows((prev) =>
//       prev.includes(index)
//         ? prev.filter((i) => i !== index)
//         : [...prev, index]
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectedRows.length === filteredData.length && filteredData.length > 0) {
//       setSelectedRows([]);
//     } else {
//       setSelectedRows(filteredData.map((_, index) => index));
//     }
//   };

//   const filteredData = data
//     ? data.filter((item) => {
//         const matchesSearch = item[columns[0].key]
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase());
//         const matchesFilters = Object.keys(selectedFilters).every((key) => {
//           const filterValue = selectedFilters[key];
//           return filterValue === (key === "accountStatus" ? "Account status" : "User specialization") || item[key] === filterValue;
//         });
//         return matchesSearch && matchesFilters;
//       })
//     : [];

//   return (
//     <div className={cn("w-full p-4", className)} {...props}>
//       <div className="flex justify-between mb-4 space-x-4">
//         <div className="relative w-1/3">
//           <Input
//             type="text"
//             placeholder="Search for user..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//             className="pl-12 py-2 w-full border rounded"
//           />
//           <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
//         </div>
//         <div className="flex items-center space-x-2">
//           {filterKeys && filterKeys.map((key) => (
//             <Combobox
//               key={key}
//               value={selectedFilters[key] || (key === "accountStatus" ? "Account status" : "User specialization")}
//               onValueChange={handleFilterChange(key)}
//               options={filterValues[key]?.map((value) => ({ value, label: value })) || []}
//               placeholder={key === "accountStatus" ? "Account status" : "User specialization"}
//               className="w-[200px] p-4 bg-bgGray border rounded text-bg-primary font-semibold"
//             />
//           ))}
//         </div>
//       </div>
//       <div data-slot="table-container" className="relative w-full overflow-x-auto">
//         <table
//           data-slot="table"
//           className={cn("w-full caption-bottom text-sm", className)}
//           {...props}
//         >
//           <TableHeader>
//             <TableRow>
//               <TableHead></TableHead>
//               {columns.map((col) => (
//                 <TableHead key={col.key}>{col.label}</TableHead>
//               ))}
//               <TableHead>Options</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredData.map((item, index) => (
//               <TableRow key={index}>
//                 <TableCell  className="p-4" >
//                   <input
//                     type="checkbox"
//                     checked={selectedRows.includes(index)}
//                     onChange={() => handleRowSelect(index)}
//                   />
//                 </TableCell>
//                 {columns.map((col) => (
//                   <TableCell  className="p-4"  key={col.key}>
//                     {col.key === "status" ? (
//                       <span
//                         className={cn(
//                           "px-2 py-1 rounded-full",
//                           item[col.key] === "Activated"
//                             ? "bg-green-200 text-green-800"
//                             : item[col.key] === "Suspended"
//                             ? "bg-red-200 text-red-800"
//                             : "bg-yellow-200 text-yellow-800"
//                         )}
//                       >
//                         {item[col.key]}
//                       </span>
//                     ) : (
//                       item[col.key]
//                     )}
//                   </TableCell>
//                 ))}
//                 <TableCell  className="p-4" >
//                   <div className="flex space-x-2">
//                     <button onClick={() => onView && onView(item)} className="text-blue-500">👁️</button>
//                     <button onClick={() => onEdit && onEdit(item)} className="text-blue-500">✏️</button>
//                     <button onClick={() => onDelete && onDelete(item)} className="text-red-500">🗑️</button>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </table>
//       </div>
//     </div>
//   );
// }

// function TableHeader({ className, ...props }) {
//   return (
//     <thead
//       data-slot="table-header"
//       className={cn("[&_tr]:border-b", className)}
//       {...props}
//     />
//   );
// }

// function TableBody({ className, ...props }) {
//   return (
//     <tbody
//       data-slot="table-body"
//       className={cn("[&_tr:last-child]:border-0", className)}
//       {...props}
//     />
//   );
// }

// function TableRow({ className, ...props }) {
//   return (
//     <tr
//       data-slot="table-row"
//       className={cn(
//         "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
//         className
//       )}
//       {...props}
//     />
//   );
// }

// function TableHead({ className, ...props }) {
//   return (
//     <th
//       data-slot="table-head"
//       className={cn(
//         "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
//         className
//       )}
//       {...props}
//     />
//   );
// }

// function TableCell({ className, ...props }) {
//   return (
//     <td
//       data-slot="table-cell"
//       className={cn(
//         "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
//         className
//       )}
//       {...props}
//     />
//   );
// }

// export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion"; // For animations

function Table({
  data,
  columns,
  filterKeys,
  className,
  onView,
  onEdit,
  onDelete,
  statusKey,
  titles,
  ...props
}) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isFilterOpen, setIsFilterOpen] = React.useState(false); // State for filter panel

  // Initialize selectedFilters with default title values for each filterKey
  const initialFilters = React.useMemo(() => {
    const filters = {};
    if (filterKeys) {
      filterKeys.forEach((key) => {
        filters[key] = titles?.[key] || key.charAt(0).toUpperCase() + key.slice(1);
      });
    }
    return filters;
  }, [filterKeys, titles]);

  const [selectedFilters, setSelectedFilters] = React.useState(initialFilters);

  // Dynamically generate filter options
  const filterValues = React.useMemo(() => {
    const valuesMap = {};
    if (data && filterKeys) {
      filterKeys.forEach((key) => {
        const title = titles?.[key] || key.charAt(0).toUpperCase() + key.slice(1);
        valuesMap[key] = [
          title,
          ...new Set(data.map((item) => item[key]?.trim())),
        ].filter(Boolean);
      });
    }
    return valuesMap;
  }, [data, filterKeys, titles]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (key) => (value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFilterClick = (key) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: titles?.[key] || key.charAt(0).toUpperCase() + key.slice(1),
    }));
  };

  const [selectedRows, setSelectedRows] = React.useState([]);

  const handleRowSelect = (index) => {
    setSelectedRows((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const filteredData = data
    ? data.filter((item) => {
        const matchesSearch = item[columns[0].key]
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesFilters = filterKeys.every((key) => {
          const filterValue = selectedFilters[key];
          const title = titles?.[key] || key.charAt(0).toUpperCase() + key.slice(1);
          if (filterValue === title) return true;
          return item[key]?.trim() === filterValue;
        });
        return matchesSearch && matchesFilters;
      })
    : [];

  return (
    <div className={cn("w-full p-4", className)} {...props}>
      {/* Search and Filter Section */}
      <div className="mb-4">
        {/* Desktop Layout: Horizontal */}
        <div className="hidden xl:flex xl:flex-row xl:items-center xl:justify-between md:gap-4">
          <div className="relative flex-1 max-w-xs">
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-12 py-2 w-full border rounded"
            />
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
          </div>
          <div className="flex flex-row gap-2">
            {filterKeys &&
              filterKeys.map((key) => (
                <Combobox
                  key={key}
                  value={
                    selectedFilters[key] ||
                    (titles?.[key] || key.charAt(0).toUpperCase() + key.slice(1))
                  }
                  onValueChange={handleFilterChange(key)}
                  onClick={() => handleFilterClick(key)}
                  options={
                    filterValues[key]?.map((value) => ({
                      value,
                      label: value,
                    })) || []
                  }
                  placeholder={titles?.[key] || key.charAt(0).toUpperCase() + key.slice(1)}
                  className="w-[200px] p-4 bg-bgGray border rounded text-bg-primary font-semibold"
                />
              ))}
          </div>
        </div>

        {/* Mobile Layout: Collapsible Filter Panel */}
        <div className="xl:hidden">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-12 py-2 w-full border rounded"
              />
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex-shrink-0"
            >
              <Filter size={20} />
            </Button>
          </div>

          {/* Animated Filter Panel */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="mt-2 overflow-hidden bg-bgGray border rounded-lg p-4"
              >
                <div className="grid grid-cols-2 gap-3">
                  {filterKeys &&
                    filterKeys.map((key) => (
                      <Combobox
                        key={key}
                        value={
                          selectedFilters[key] ||
                          (titles?.[key] || key.charAt(0).toUpperCase() + key.slice(1))
                        }
                        onValueChange={handleFilterChange(key)}
                        onClick={() => handleFilterClick(key)}
                        options={
                          filterValues[key]?.map((value) => ({
                            value,
                            label: value,
                          })) || []
                        }
                        placeholder={
                          titles?.[key] || key.charAt(0).toUpperCase() + key.slice(1)
                        }
                        className="w-full p-4 bg-white border rounded text-bg-primary font-semibold"
                      />
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Table Content (Unchanged) */}
      <div data-slot="table-container" className="relative w-full overflow-x-auto">
        <table
          data-slot="table"
          className={cn("w-full caption-bottom text-sm", className)}
          {...props}
        >
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              <TableHead>Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(index)}
                    onChange={() => handleRowSelect(index)}
                  />
                </TableCell>
                {columns.map((col) => (
                  <TableCell className="" key={col.key}>
                    {col.key === statusKey ? (
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full",
                          item[col.key] === "Activated"
                            ? "bg-green-200 text-green-800"
                            : item[col.key] === "Suspended"
                            ? "bg-red-200 text-red-800"
                            : item[col.key] === "Waiting for activation"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-gray-200 text-gray-800"
                        )}
                      >
                        {item[col.key]}
                      </span>
                    ) : (
                      item[col.key]
                    )}
                  </TableCell>
                ))}
                <TableCell className="p-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onView && onView(item)}
                      className="text-blue-500"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => onEdit && onEdit(item)}
                      className="text-blue-500"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(item)}
                      className="text-red-500"
                    >
                      🗑️
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </table>
      </div>
    </div>
  );
}

// Unchanged TableHeader, TableBody, TableRow, TableHead, TableCell components
function TableHeader({ className, ...props }) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableRow({ className, ...props }) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };