"use client";

import { useMemo, useState } from "react";
import { Control, Controller, FieldError } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import countryList from "react-select-country-list";

type CountrySelectProps = {
  name: string;
  label: string;
  control: Control<any>;
  error?: FieldError; // optional; we'll still render RHF's own field error
  required?: boolean;
};

type CountryOption = { label: string; value: string };

const Flag = ({
  code,
  label,
  className = "",
}: {
  code: string;
  label?: string;
  className?: string;
}) => (
  <span
    className={cn(
      `fi fi-${code.toLowerCase()}`,
      "inline-block align-middle",
      className
    )}
    aria-label={label ?? code}
    title={label ?? code}
  />
);

const CountrySelect = ({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  // Stable list (don’t recompute every render)
  const countries = useMemo<CountryOption[]>(
    () => countryList().getData() as CountryOption[],
    []
  );

  const selected = value ? countries.find((c) => c.value === value) : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="country-select-trigger"
        >
          {selected ? (
            <span className="flex items-center gap-2">
              <Flag
                code={selected.value}
                label={selected.label}
                className="text-lg"
              />
              <span>{selected.label}</span>
            </span>
          ) : (
            "Select your country..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-full p-0 bg-gray-800 border-gray-600"
        align="start"
      >
        <Command className="bg-gray-800 border-gray-600">
          <CommandInput
            placeholder="Search countries..."
            className="country-select-input"
          />
          <CommandEmpty className="country-select-empty">
            No country found.
          </CommandEmpty>
          <CommandList className="max-h-60 bg-gray-800 scrollbar-hide-default">
            <CommandGroup className="bg-gray-800">
              {countries.map((country) => (
                <CommandItem
                  key={country.value}
                  value={`${country.label} ${country.value}`}
                  onSelect={() => {
                    onChange(country.value);
                    setOpen(false);
                  }}
                  className="country-select-item"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 text-yellow-500",
                      value === country.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="flex items-center gap-2">
                    <Flag
                      code={country.value}
                      label={country.label}
                      className="text-base"
                    />
                    <span>{country.label}</span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export const CountrySelectField = ({
  name,
  label,
  control,
  error: externalError,
  required = false,
}: CountrySelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>

      <Controller
        name={name}
        control={control}
        defaultValue="" // ensure controlled from first render
        rules={{
          required: required ? `Please select ${label.toLowerCase()}` : false,
        }}
        render={({ field, fieldState: { error } }) => (
          <>
            <CountrySelect value={field.value} onChange={field.onChange} />
            {(error || externalError) && (
              <p className="text-sm text-red-500">
                {(error || externalError)?.message}
              </p>
            )}
          </>
        )}
      />

      <p className="text-xs text-gray-500">
        Helps us show market data and news relevant to you.
      </p>
    </div>
  );
};
