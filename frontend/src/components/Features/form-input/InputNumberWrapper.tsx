import { Label } from "@/components/ui/shadcn/Label";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Control, Controller, FieldErrors, FieldPath } from "react-hook-form";
import { ErrorText } from "../ErrorText";
import { FormTypes } from "@/interfaces/general";
import { obterValorAninhadoComArray } from "@/utils/errorParser";
import { InputNumber } from "../InputNumber";

type InputNumberWrapperProps<T extends FormTypes> = Readonly<{
  name: FieldPath<T>;
  control: Control<T>;
  errors?: FieldErrors<T>;
  onChange?: (value: number | string) => void;
  label?: string;
  labelIcon?: React.ReactNode;
  labelTooltip?: string;
  placeholder?: string;
  isReadOnly?: boolean;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  labelPosition?: "top" | "right" | "left";
  noErrorMsg?: boolean;
  allowNegative?: boolean;
}>;

export function InputNumberWrapper<T extends FormTypes>({
  name,
  control,
  errors,
  onChange,
  label,
  inputClassName,
  labelClassName,
  labelIcon,
  labelTooltip,
  labelPosition = "top",
  placeholder,
  isReadOnly,
  disabled,
  className,
  noErrorMsg = false,
  allowNegative = true,
}: Readonly<InputNumberWrapperProps<T>>) {
  const inputId = `${String(name)}`;
  const fieldError = obterValorAninhadoComArray(errors, name);
  const hasError = !!fieldError;
  const errorMessage = hasError ? String(fieldError?.message) : "";

  const renderLabel = () =>
    label ? (
      <Label
        htmlFor={inputId}
        className={cn(
          "text-sm leading-[1.5] font-medium text-[#2C2E34]",
          "mb-2 flex items-center gap-2",
          {
            "opacity-80": disabled,
          },
          labelClassName,
        )}
        aria-invalid={hasError || undefined}
      >
        {label}
        {labelTooltip ? (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn("cursor-help")}>{labelIcon}</span>
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
    ) : null;

  return (
    <>
      {labelPosition === "top" && renderLabel()}

      <div
        className={cn(
          "flex items-center",
          labelPosition === "right" && "gap-2",
          labelPosition === "left" && "flex-row-reverse gap-2",
        )}
      >
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <InputNumber
              placeholder={placeholder}
              value={field.value as number | string}
              onChange={(value) => {
                field.onChange(value);

                onChange?.(value);
              }}
              className={className}
              inputClassName={inputClassName}
              hasError={hasError}
              aria-invalid={hasError || undefined}
              disabled={disabled || isReadOnly}
              hideButtons={isReadOnly}
              allowNegative={allowNegative}
            />
          )}
        />

        {(labelPosition === "right" || labelPosition === "left") &&
          renderLabel()}
      </div>

      <ErrorText
        message={errorMessage}
        disabled={disabled}
        hidden={noErrorMsg}
      />
    </>
  );
}
