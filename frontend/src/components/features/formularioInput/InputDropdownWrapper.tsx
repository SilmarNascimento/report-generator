import { Control, Controller, FieldErrors, FieldPath } from "react-hook-form";
import { DropdownType, FormTypes } from "@/types/general";
import { obterValorAninhadoComArray } from "@/util/errorParser";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import UnifiedDropdown from "@/components/features/UnifiedDropdown";

type InputDropdownWrapperProps<T extends FormTypes> = Readonly<{
  name: FieldPath<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  label?: string;
  options: DropdownType[];
  defaultValue?: string;
  placeholder?: string;
  isReadOnly?: boolean;
  className?: string;
  labelFontSize?: number;
  textFontSize?: number;
  handleChange?: (value: string) => void;
}>;

export function InputDropdownWrapper<T extends FormTypes>({
  name,
  control,
  errors,
  label,
  labelFontSize,
  textFontSize,
  options,
  defaultValue,
  placeholder = "",
  isReadOnly = false,
  className = "",
  handleChange,
}: Readonly<InputDropdownWrapperProps<T>>) {
  const fieldError = obterValorAninhadoComArray(errors, name);
  const hasFieldError = !!fieldError;
  const fieldErrorMessage = hasFieldError ? String(fieldError?.message) : "";

  const fontLabel = `text-[${labelFontSize}rem]`;
  const fontText = `text-[${textFontSize}rem]`;

  const inputId = `${String(name)}`;

  return (
    <>
      {label && (
        <Label
          htmlFor={inputId}
          className={`mb-2 text-sm font-bold ${labelFontSize ? fontLabel : ""} ${
            hasFieldError ? "text-red-400" : "text-gray-900"
          }`}
        >
          {label}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) =>
          isReadOnly ? (
            <Input
              id={inputId}
              {...field}
              value={defaultValue}
              disabled
              className={`h-10 w-full rounded-lg border border-[#B4BAC4] px-4 text-base font-normal text-[#7F86A0] ${fontText} ${className}`}
            />
          ) : (
            <UnifiedDropdown
              id={inputId}
              value={field.value ? field.value.toString() : ""}
              defaultValue={defaultValue ?? ""}
              options={options}
              onChange={(option) => {
                if (handleChange) handleChange(option.value);
                field.onChange(option.value);
              }}
              placeholder={placeholder}
              disabled={isReadOnly}
              error={hasFieldError}
              dropdownFontSize={textFontSize}
            />
          )
        }
      />
      <p
        className={`mt-1 text-sm ${hasFieldError ? "text-red-400" : "text-transparent"}`}
      >
        {fieldErrorMessage ?? "\u00A0"}
      </p>
    </>
  );
}
