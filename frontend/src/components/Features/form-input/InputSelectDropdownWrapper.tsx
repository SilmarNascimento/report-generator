import { Control, Controller, FieldErrors, FieldPath } from "react-hook-form";
import { Label } from "@/components/ui/shadcn/Label";
import { Input } from "@/components/ui/shadcn/Input";
import UnifiedDropdown from "@/components/Features/UnifiedDropdown";
import { cn } from "@/lib/utils";
import { ErrorText } from "../ErrorText";
import { DropdownType, FormTypes } from "@/interfaces/general";
import { obterValorAninhadoComArray } from "@/utils/errorParser";

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
  queryValue?: string;
  onQueryChange?: (value: string) => void;
  options: OpcoesType[];
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  handleChange?: (option: OpcoesType) => void;
  noErrorMsg?: boolean;
  disabledOptions?: string[];
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
  disabledOptions,
}: Readonly<InputSelectDropdownWrapperProps<T, OpcoesType>>) {
  const fieldError = obterValorAninhadoComArray(errors, name);
  const hasError = !!fieldError;
  const errorMessage = hasError ? String(fieldError?.message) : "";

  const inputId = `${String(name)}`;

  return (
    <>
      {label && (
        <Label
          htmlFor={inputId}
          className={cn(
            "mb-2 text-sm leading-[1.5] font-medium text-[#28272C]",
            {
              "opacity-80": disabled,
            },
            labelClassName,
          )}
          aria-invalid={hasError || undefined}
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
                "text-sm leading-[1.5] font-normal text-[#494C57]",
                "h-10 w-full rounded-lg border border-[#CED2D7] px-4",
                inputClassName,
              )}
            />
          ) : (
            <UnifiedDropdown<OpcoesType>
              id={inputId}
              placeholder={placeholder}
              queryValue={queryValue}
              options={options}
              value={field.value ?? ""}
              className={inputClassName}
              onChange={(option) => {
                const value = option?.value ?? "";

                field.onChange(value);
                handleChange?.(option);
              }}
              onQueryChange={onQueryChange}
              error={hasError}
              disabledOptions={disabledOptions}
              disabled={disabled}
              allowSearch
            />
          )
        }
      />

      <ErrorText
        message={errorMessage}
        disabled={disabled}
        hidden={noErrorMsg}
      />
    </>
  );
}
