import { BadgeDropdownType, DropdownType, FormTypes } from "@/types/general";
import UnifiedDropdown from "@/components/features/UnifiedDropdown";
import { Control, Controller, FieldErrors, FieldPath } from "react-hook-form";
import { useMemo } from "react";
import { Label } from "@/components/ui/shadcn/label";
import { obterValorAninhadoComArray } from "@/util/errorParser";
import { cn } from "@/lib/utils";

type BadgeDropdownProps<T extends FormTypes> = Readonly<{
  name: FieldPath<T>;
  control: Control<T>;
  errors?: FieldErrors<T>;
  value?: string;
  label?: string;
  labelClassName?: string;
  queryValue: string;
  onQueryChange: (value: string) => void;
  options: BadgeDropdownType[];
  placeholder?: string;
  handleChange?: (value: DropdownType) => void;
  disabled?: boolean;
  noErrorMsg?: boolean;
}>;

export function InputBadgeDropdownWrapper<T extends FormTypes>({
  name,
  control,
  errors,
  value,
  label,
  labelClassName,
  queryValue,
  onQueryChange,
  options,
  placeholder = "Selecione...",
  handleChange,
  disabled = false,
  noErrorMsg = false,
}: Readonly<BadgeDropdownProps<T>>) {
  const fieldError = obterValorAninhadoComArray(errors, name);
  const hasFieldError = !!fieldError;
  const fieldErrorMessage = hasFieldError ? String(fieldError?.message) : "";

  const inputId = `${String(name)}`;
  const selectedOption = useMemo(() => {
    return options.find((opt) => opt.value === value);
  }, [options, value]);

  const filteredOptions = useMemo(() => {
    if (!queryValue) return options;

    return options.filter((opt) =>
      opt.dropdownLabel.toLowerCase().includes(queryValue.toLowerCase()),
    );
  }, [options, queryValue]);

  const transformedOptions = useMemo(() => {
    return filteredOptions.map(({ dropdownLabel, value }) => ({
      label: dropdownLabel,
      value,
    }));
  }, [filteredOptions]);

  if (selectedOption) {
    return (
      <div className="flex min-h-[40px] items-center rounded-lg px-4 py-2 text-gray-800">
        <span className="truncate">{selectedOption.displayLabel}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {label && (
        <Label
          htmlFor={name}
          className={cn(
            "mb-2 text-sm leading-5 font-medium text-[#28272C]",
            hasFieldError ? "text-red-400" : "text-gray-800",
            labelClassName,
          )}
        >
          {label}
        </Label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <UnifiedDropdown
            id={inputId}
            placeholder={placeholder}
            queryValue={queryValue}
            options={transformedOptions}
            defaultValue={""}
            onChange={(item) => {
              const { value, label } = item;

              if (handleChange) {
                handleChange({ value, label });
              } else {
                field.onChange(value);
              }
              onQueryChange("");
            }}
            disabled={disabled}
            onQueryChange={onQueryChange}
            allowSearch
          />
        )}
      />
      {!noErrorMsg && (
        <p
          className={cn(
            "min-h-5 text-sm",
            hasFieldError ? "text-red-400" : "invisible",
          )}
        >
          {fieldErrorMessage ?? "\u00A0"}
        </p>
      )}
    </div>
  );
}
