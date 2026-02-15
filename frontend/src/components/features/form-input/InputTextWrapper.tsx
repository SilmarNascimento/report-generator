import { Input } from "@/components/ui/shadcn/input";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Control, Controller, FieldErrors, FieldPath } from "react-hook-form";
import { formatters } from "@/utils/validacoes/formatadorTexto";
import { ErrorText } from "../ErrorText";
import { FormTypes } from "@/interfaces/general";
import { obterValorAninhadoComArray } from "@/utils/errorParser";
import { Label } from "@/components/ui/shadcn/label";

type InputTextWrapperProps<T extends FormTypes> = Readonly<{
  name: FieldPath<T>;
  control: Control<T>;
  errors?: FieldErrors<T>;
  label?: string;
  labelClassName?: string;
  labelIcon?: React.ReactNode;
  labelTooltip?: string;
  className?: string;
  placeholder?: string;
  isReadOnly?: boolean;
  disabled?: boolean;
  noErrorMsg?: boolean;
  format?: keyof typeof formatters;
  onChange?: (value: string) => void;
}>;

export function InputTextWrapper<T extends FormTypes>({
  name,
  control,
  errors,
  label,
  labelClassName,
  labelIcon,
  labelTooltip,
  className,
  isReadOnly = false,
  placeholder,
  disabled = false,
  noErrorMsg = false,
  format,
  onChange,
}: Readonly<InputTextWrapperProps<T>>) {
  const fieldError = obterValorAninhadoComArray(errors, name);
  const hasError = !!fieldError;
  const errorMessage = hasError ? String(fieldError?.message) : "";

  const inputId = `${String(name)}`;
  const formatter = format ? formatters[format] : undefined;

  return (
    <>
      {label && (
        <Label
          htmlFor={inputId}
          className={cn(
            "text-sm leading-[1.5] font-medium text-[#28272C]",
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
        render={({ field }) => {
          const formattedValue = formatter
            ? formatter.format(field.value ?? "")
            : field.value || "";

          return (
            <Input
              id={inputId}
              type="text"
              placeholder={placeholder}
              className={cn(
                "text-sm leading-[1.5] font-normal text-[#494C57]",
                "h-10 w-full truncate overflow-hidden rounded-lg border px-3 py-2 pr-10 text-ellipsis whitespace-nowrap",
                {
                  "[&:disabled]:opacity-80": disabled,
                },
                className,
              )}
              value={formattedValue}
              onChange={(e) => {
                const raw = e.target.value;
                const normalized = formatter ? formatter.normalize(raw) : raw;

                field.onChange(normalized);

                onChange?.(normalized);
              }}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
              aria-invalid={hasError || undefined}
              disabled={isReadOnly || disabled}
            />
          );
        }}
      />

      <ErrorText
        message={errorMessage}
        disabled={disabled}
        hidden={noErrorMsg}
      />
    </>
  );
}
