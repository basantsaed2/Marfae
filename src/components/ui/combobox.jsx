// src/components/ui/combobox.jsx
"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/**
 * Custom filter:
 * - Empty options → "No data available."
 * - Search + no matches → "No option found."
 * - Search + matches → only matching items
 * - No search → all items
 */
function CustomFilter({ search, children, placeholder, hasOptions }) {
  // 1. No options at all
  if (!hasOptions) {
    return (
      <div className="py-6 text-center text-sm text-gray-500">
        No data available.
      </div>
    );
  }

  // 2. Search active
  if (search) {
    const lower = search.toLowerCase();
    const matches = [];

    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return;
      const label = child.props.children?.[0];
      if (typeof label !== "string") return;

      if (label.toLowerCase().includes(lower)) {
        matches.push(child);
      }
    });

    if (matches.length === 0) {
      return (
        <div className="py-6 text-center text-sm text-gray-500">
          No {placeholder?.toLowerCase() ?? "option"} found.
        </div>
      );
    }

    return <>{matches}</>;
  }

  // 3. No search → show all
  return <>{children}</>;
}

/* ============================================================= */
/*                     SINGLE-SELECT COMBOBOX                     */
/* ============================================================= */
export function Combobox({
  value,
  onValueChange,
  options = [],
  placeholder = "Select…",
  className,
}) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const triggerRef = React.useRef(null);
  const [contentWidth, setContentWidth] = React.useState("200px");

  const hasOptions = options.length > 0;
  const selected = options.find((o) => o.value === value);
  const displayText = selected ? selected.label : placeholder;

  React.useEffect(() => {
    if (triggerRef.current && open) {
      const w = triggerRef.current.getBoundingClientRect().width;
      setContentWidth(`${w}px`);
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between overflow-hidden", className)}
          ref={triggerRef}
        >
          <span className="truncate flex-1 text-left">{displayText}</span>
          <ChevronsUpDown className="!ml-2 h-4 w-4 text-bg-primary font-bold shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn("!p-0 bg-white")}
        style={{ width: contentWidth }}
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            className="h-9"
            onValueChange={setSearch}
          />

          <CommandList>
            <CommandEmpty className="hidden" />
            <CommandGroup>
              <CustomFilter
                search={search}
                placeholder={placeholder}
                hasOptions={hasOptions}
              >
                {options.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.label}
                    onSelect={(label) => {
                      const found = options.find((o) => o.label === label);
                      onValueChange(
                        value === found?.value ? "" : found?.value ?? ""
                      );
                      setOpen(false);
                      setSearch("");
                    }}
                  >
                    {opt.label}
                    <Check
                      className={cn(
                        "!ml-auto h-4 w-4",
                        value === opt.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CustomFilter>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/* ============================================================= */
/*                     MULTI-SELECT COMBOBOX                      */
/* ============================================================= */
export function ComboboxMultiSelect({
  value,
  onValueChange,
  options = [],
  placeholder = "Select…",
  className,
}) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const triggerRef = React.useRef(null);
  const [contentWidth, setContentWidth] = React.useState("200px");

  const hasOptions = options.length > 0;
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

  React.useEffect(() => {
    if (triggerRef.current && open) {
      const w = triggerRef.current.getBoundingClientRect().width;
      setContentWidth(`${w}px`);
    }
  }, [open]);

  const handleSelect = (label) => {
    const opt = options.find((o) => o.label === label);
    if (!opt) return;

    const newVals = selectedValues.includes(opt.value)
      ? selectedValues.filter((v) => v !== opt.value)
      : [...selectedValues, opt.value];

    onValueChange(newVals);
  };

  const displayText =
    selectedValues.length > 0
      ? selectedValues
          .map((v) => options.find((o) => o.value === v)?.label)
          .filter(Boolean)
          .join(", ")
      : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between overflow-hidden", className)}
          ref={triggerRef}
        >
          <span className="truncate flex-1 text-left">{displayText}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 text-bg-primary font-bold shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn("p-0 bg-white")}
        style={{ width: contentWidth }}
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            className="h-9"
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty className="hidden" />
            <CommandGroup>
              <CustomFilter
                search={search}
                placeholder={placeholder}
                hasOptions={hasOptions}
              >
                {options.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.label}
                    onSelect={handleSelect}
                  >
                    {opt.label}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedValues.includes(opt.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CustomFilter>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}