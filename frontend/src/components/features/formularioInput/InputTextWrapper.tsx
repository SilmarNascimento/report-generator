import { Control, Controller, FieldErrors, FieldPath } from "react-hook-form";
import { FormTypes } from "@/types/general";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { obterValorAninhadoComArray } from "@/utils/errorParser";

type InputTextWrapperProps<T extends FormTypes> = Readonly<{
  name: FieldPath<T>;
  control: Control<T>;
  errors?: FieldErrors<T>;
  label?: string;
  labelFontSize?: number;
  labelIcon?: React.ReactNode;
  labelTooltip?: string;
  textFontSize?: number;
  className?: string;
  placeholder?: string;
  isReadOnly?: boolean;
  disabled?: boolean;
}>;

export function InputTextWrapper<T extends FormTypes>({
  name,
  control,
  errors,
  label,
  labelFontSize,
  labelIcon,
  labelTooltip,
  textFontSize,
  className,
  isReadOnly = false,
  placeholder,
  disabled = false,
}: Readonly<InputTextWrapperProps<T>>) {
  const fieldError = obterValorAninhadoComArray(errors, name);
  const hasError = !!fieldError;
  const errorMessage = hasError ? String(fieldError?.message) : "";
  const fontLabel = `text-[${labelFontSize}rem]`;
  const fontText = `text-[${textFontSize}rem]`;
  let labelColor = "text-gray-800";

  if (hasError) {
    labelColor = "text-red-400";
  } else if (disabled) {
    labelColor = "opacity-60";
  }

  const inputId = `${String(name)}`;

  const inputClassName = `text-base font-normal h-10 w-full border rounded-lg px-4 xl:truncate
    ${
      hasError
        ? "border-red-400 text-red-400 placeholder-red-500 focus:outline-none"
        : "border-[#B4BAC4]"
    }
    ${isReadOnly ? " text-[#7F86A0]" : ""}
    ${textFontSize ? fontText : ""}
    ${className ? className : ""}`;

  return (
    <>
      {label && (
        <Label
          htmlFor={inputId}
          className={`mb-2 flex h-4 items-center gap-2 text-sm font-bold ${labelFontSize ? fontLabel : ""} ${labelColor}`}
        >
          {label}
          {labelTooltip ? (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help">{labelIcon}</span>
                </TooltipTrigger>
                <TooltipContent side="top">{labelTooltip}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            labelIcon
          )}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            id={inputId}
            {...field}
            placeholder={placeholder}
            className={inputClassName}
            disabled={isReadOnly || disabled}
            value={field.value ? String(field.value) : ""}
          />
        )}
      />

      <p
        className={`mt-1 text-sm ${
          hasError ? "text-red-400" : "text-transparent"
        }`}
      >
        {errorMessage || "\u00A0"}
      </p>
    </>
  );
}
