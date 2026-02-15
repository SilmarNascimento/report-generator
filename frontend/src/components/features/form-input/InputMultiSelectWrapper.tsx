import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/shadcn/label";
import { ErrorText } from "../ErrorText";
import { BadgeDropdownType } from "@/interfaces/general";
import { obterValorAninhadoComArray } from "@/utils/errorParser";
import MultiSelectDropdown from "../MultiSelectDropdown";

type InputMultiSelectWrapperProps<
  TFieldValues extends FieldValues,
  TOption extends BadgeDropdownType,
> = {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  errors?: FieldErrors<TFieldValues>;
  label?: string;
  labelClassName?: string;
  options: TOption[];
  placeholder?: string;
  disabled?: boolean;
  dropdownFontSize?: number;
  allowSearch?: boolean;
  showBadges?: boolean;
  className?: string;
  queryValue?: string;
  onQueryChange?: (query: string) => void;
  noErrorMsg?: boolean;
  onChange?: (values: TOption[]) => void;
};

export function InputMultiSelectWrapper<
  TFieldValues extends FieldValues,
  TOption extends BadgeDropdownType,
>({
  name,
  control,
  errors,
  label,
  labelClassName,
  options,
  placeholder,
  disabled = false,
  dropdownFontSize,
  allowSearch = false,
  showBadges = false,
  className,
  queryValue,
  onQueryChange,
  noErrorMsg,
  onChange,
}: InputMultiSelectWrapperProps<TFieldValues, TOption>) {
  const fieldError = obterValorAninhadoComArray(errors, name);
  const hasFieldError = !!fieldError;
  const errorMessage = hasFieldError ? String(fieldError?.message) : "";

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <Label
          htmlFor={name}
          className={cn(
            "text-sm leading-[1.5] font-medium text-[#28272C]",
            labelClassName,
          )}
        >
          {label}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <MultiSelectDropdown
            id={name}
            options={options}
            value={field.value || []}
            onChange={(val) => {
              field.onChange(val);
              onChange?.(val);
            }}
            placeholder={placeholder}
            disabled={disabled}
            error={!!fieldState.error}
            dropdownFontSize={dropdownFontSize}
            allowSearch={allowSearch}
            showBadges={showBadges}
            queryValue={queryValue}
            onQueryChange={onQueryChange}
          />
        )}
      />

      <ErrorText
        message={errorMessage}
        disabled={disabled}
        hidden={noErrorMsg}
      />
    </div>
  );
}
