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

export function Combobox({ value, onValueChange, options, placeholder, className }) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef(null);
  const [contentWidth, setContentWidth] = React.useState("200px");

  // Find the selected option's label based on the value
  const selectedOption = options.find((option) => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  // Update content width based on trigger width
  React.useEffect(() => {
    if (triggerRef.current) {
      const width = triggerRef.current.getBoundingClientRect().width;
      setContentWidth(`${width}px`);
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
          <span className="truncate flex-1 text-left">
            {displayText} {/* Use displayText instead of value */}
          </span>
          <ChevronsUpDown className="!ml-2 h-4 w-4 text-bg-primary font-bold shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("!p-0 bg-white")}
        style={{ width: contentWidth }}
        align="start"
      >
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} className="h-9" />
          <CommandList>
            <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "!ml-auto h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function ComboboxMultiSelect({ value, onValueChange, options, placeholder, className }) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef(null);
  const [contentWidth, setContentWidth] = React.useState("200px");

  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

  // Update content width based on trigger width
  React.useEffect(() => {
    if (triggerRef.current) {
      const width = triggerRef.current.getBoundingClientRect().width;
      setContentWidth(`${width}px`);
    }
  }, [open]);

  const handleSelect = (currentValue) => {
    const newValues = selectedValues.includes(currentValue)
      ? selectedValues.filter((val) => val !== currentValue)
      : [...selectedValues, currentValue];
    onValueChange(newValues);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between overflow-hidden",
            className
          )}
          ref={triggerRef}
        >
          <span className="truncate flex-1 text-left">
            {selectedValues.length > 0
              ? selectedValues
                  .map((val) => options.find((opt) => opt.value === val)?.label)
                  .join(", ") || placeholder
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 text-bg-primary font-bold shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("p-0 bg-white")}
        style={{ width: contentWidth }}
        align="start"
      >
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} className="h-9" />
          <CommandList>
            <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedValues.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}