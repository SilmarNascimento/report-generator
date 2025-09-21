import { Controller, Control, FieldPath, FieldErrors } from "react-hook-form";
import { obterValorAninhadoComArray } from "@/util/errorParser";
import { FormTypes } from "@/types/general";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Label } from "@/components/ui/shadcn/label";
import { InputNumber } from "../InputNumber";

type InputNumberWrapperProps<T extends FormTypes> = Readonly<{
  name: FieldPath<T>;
  control: Control<T>;
  errors?: FieldErrors<T>;
  label?: string;
  labelFontSize?: number;
  labelIcon?: React.ReactNode;
  labelTooltip?: string;
  placeholder?: string;
  isReadOnly?: boolean;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  noErrorMsg?: boolean;
}>;

export function InputNumberWrapper<T extends FormTypes>({
  name,
  control,
  errors,
  label,
  labelFontSize,
  labelIcon,
  labelTooltip,
  placeholder,
  isReadOnly,
  disabled,
  className,
  inputClassName,
  noErrorMsg = false,
}: Readonly<InputNumberWrapperProps<T>>) {
  const inputId = `${String(name)}`;
  const fieldError = obterValorAninhadoComArray(errors, name);
  const hasError = !!fieldError;
  const fontLabel = `text-[${labelFontSize}rem]`;
  let labelColor = "text-gray-800";

  if (hasError) {
    labelColor = "text-red-400";
  } else if (disabled) {
    labelColor = "opacity-60";
  }

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
                <TooltipContent side="top" className="max-w-xs text-xs">
                  {labelTooltip}
                </TooltipContent>
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
          <InputNumber
            value={field.value ?? 0}
            onChange={field.onChange}
            placeholder={placeholder}
            disabled={disabled || isReadOnly}
            className={className}
            inputClassName={inputClassName}
          />
        )}
      />

      {!noErrorMsg && (
        <p
          className={`mt-1 overflow-visible text-sm whitespace-nowrap ${
            hasError ? "text-red-400" : "text-transparent"
          }`}
        >
          {hasError ? String(fieldError?.message) : "\u00A0"}
        </p>
      )}
    </>
  );
}
