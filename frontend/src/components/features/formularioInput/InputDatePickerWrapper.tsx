import {
  Controller,
  Control,
  FieldPath,
  FieldErrors,
  FieldError,
} from "react-hook-form";
import { Label } from "@/components/ui/shadcn/label";
import { FormTypes, RangeFieldError } from "@/types/general";
import { obterValorAninhadoComArray } from "@/util/errorParser";
import { DatePicker } from "../DatePicker";
import { DateRange } from "react-day-picker";

type InputDatePickerWrapperProps<T extends FormTypes> = {
  name: FieldPath<T>;
  control: Control<T>;
  errors?: FieldErrors<T>;
  label?: string;
  allowRange?: boolean;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  noErrorMsg?: boolean;
};

export function InputDatePickerWrapper<T extends FormTypes>({
  name,
  control,
  errors,
  label,
  allowRange = false,
  disabled = false,
  minDate,
  maxDate,
  placeholder,
  noErrorMsg = false,
}: InputDatePickerWrapperProps<T>) {
  const fieldError = allowRange
    ? obterValorAninhadoComArray<FormTypes, RangeFieldError>(errors, name)
    : obterValorAninhadoComArray<FormTypes, FieldError>(errors, name);

  const errorMessage = allowRange
    ? (fieldError as RangeFieldError)?.from?.message ||
      (fieldError as RangeFieldError)?.to?.message
    : (fieldError as FieldError)?.message;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <Label
          htmlFor={name}
          className={errorMessage ? "text-red-400" : "text-gray-800"}
        >
          {label}
        </Label>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field }) =>
          allowRange ? (
            <DatePicker
              allowRange={true}
              value={field.value as DateRange | undefined}
              onChange={
                field.onChange as (range: DateRange | undefined) => void
              }
              placeholder={placeholder}
              disabled={disabled}
              minDate={minDate}
              maxDate={maxDate}
              error={!!errorMessage}
            />
          ) : (
            <DatePicker
              allowRange={false}
              value={field.value as Date | undefined}
              onChange={field.onChange as (date: Date | undefined) => void}
              placeholder={placeholder}
              disabled={disabled}
              minDate={minDate}
              maxDate={maxDate}
              error={!!errorMessage}
            />
          )
        }
      />
      {!noErrorMsg && (
        <p
          className={`mt-1 text-sm ${errorMessage ? "text-red-400" : "text-transparent"}`}
        >
          {errorMessage ?? "\u00A0"}
        </p>
      )}
    </div>
  );
}
