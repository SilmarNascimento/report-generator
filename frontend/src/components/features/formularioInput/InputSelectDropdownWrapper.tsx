import { Control, Controller, FieldErrors, FieldPath } from "react-hook-form";
import { DropdownType, FormTypes } from "@/types/general";
import { obterValorAninhadoComArray } from "@/util/errorParser";
import { Label } from "@/components/ui/shadcn/label";
import { Input } from "@/components/ui/shadcn/input";
import UnifiedDropdown from "@/components/features/UnifiedDropdown";
import { cn } from "@/lib/utils";

type InputSelectDropdownWrapperProps<
  T extends FormTypes,
  OpcoesType extends DropdownType,
> = {
  name: FieldPath<T>;
  control: Control<T>;
  errors?: FieldErrors<T>;
  label?: string;
  labelClassName?: string;
  inputClassName?: string;
  isReadOnly?: boolean;
  queryValue: string;
  onQueryChange: (value: string) => void;
  options: OpcoesType[];
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  handleChange?: (option: OpcoesType) => void;
  noErrorMsg?: boolean;
};

export function InputSelectDropdownWrapper<
  T extends FormTypes,
  OpcoesType extends DropdownType,
>({
  name,
  control,
  errors,
  label,
  labelClassName,
  inputClassName,
  isReadOnly = false,
  queryValue,
  onQueryChange,
  options,
  defaultValue = "",
  placeholder = "Selecione...",
  disabled = false,
  noErrorMsg = false,
  handleChange,
}: Readonly<InputSelectDropdownWrapperProps<T, OpcoesType>>) {
  const fieldError = obterValorAninhadoComArray(errors, name);
  const hasError = !!fieldError;
  const errorMessage = hasError ? String(fieldError?.message) : "";

  let labelColor = "text-gray-800";

  if (hasError) {
    labelColor = "text-red-400";
  } else if (disabled) {
    labelColor = "opacity-60";
  }

  const inputId = `${String(name)}`;

  return (
    <>
      {label && (
        <Label
          htmlFor={inputId}
          className={cn("mb-2 text-sm font-bold", labelClassName, labelColor)}
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
              className={cn(
                "h-10 w-full rounded-lg border border-[#B4BAC4] px-4 text-base font-normal text-[#7F86A0]",
                inputClassName,
              )}
            />
          ) : (
            <UnifiedDropdown<OpcoesType>
              id={inputId}
              placeholder={placeholder}
              queryValue={queryValue}
              options={options}
              defaultValue={defaultValue}
              onChange={(option) => {
                if (handleChange) {
                  handleChange(option);
                } else {
                  field.onChange(option.value);
                }
              }}
              onQueryChange={onQueryChange}
              error={hasError}
              disabled={disabled}
              allowSearch
            />
          )
        }
      />

      {!noErrorMsg && (
        <p
          className={cn(
            "min-h-5 text-sm",
            errorMessage ? "text-red-400" : "invisible",
          )}
        >
          {errorMessage ?? "\u00A0"}
        </p>
      )}
    </>
  );
}
