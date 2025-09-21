import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import { BadgeDropdownType } from "@/types/general";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/shadcn/label";
import MultiSelectDropdown from "../MultiSelectDropdown";
import { obterValorAninhadoComArray } from "@/util/errorParser";

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
}: InputMultiSelectWrapperProps<TFieldValues, TOption>) {
  const fieldError = obterValorAninhadoComArray(errors, name);
  const hasFieldError = !!fieldError;
  const fieldErrorMessage = hasFieldError ? String(fieldError?.message) : "";

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <Label
          htmlFor={name}
          className={cn("text-sm leading-6 font-medium", labelClassName)}
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
            onChange={(val) => field.onChange(val)}
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
