import { Controller, Control, FieldPath, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/shadcn/label";
import { FormTypes } from "@/types/general";
import { obterValorAninhadoComArray } from "@/util/errorParser";
import { TimePicker } from "../TimePicker";

type InputTimePickerWrapperProps<T extends FormTypes> = {
  name: FieldPath<T>;
  control: Control<T>;
  errors?: FieldErrors<T>;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  noErrorMsg?: boolean;
  minTime?: string;
  maxTime?: string;
};

export function InputTimePickerWrapper<T extends FormTypes>({
  name,
  control,
  errors,
  label,
  disabled = false,
  placeholder,
  className,
  noErrorMsg = false,
  minTime,
  maxTime,
}: InputTimePickerWrapperProps<T>) {
  const fieldError = obterValorAninhadoComArray(errors, name);
  const hasError = !!fieldError;
  const errorMessage = hasError ? String(fieldError?.message) : "";

  return (
    <div className="flex flex-col">
      {label && (
        <Label
          htmlFor={name}
          className={`mb-2 flex h-4 items-center gap-2 text-sm font-bold ${hasError ? "text-red-400" : "text-gray-800"}`}
        >
          {label}
        </Label>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const value = field.value as unknown;

          const formattedTime =
            value instanceof Date && !isNaN(field.value.getTime())
              ? `${String(field.value.getHours()).padStart(2, "0")}:${String(field.value.getMinutes()).padStart(2, "0")}`
              : typeof field.value === "string"
                ? field.value
                : undefined;

          const handleTimePickerChange = (timeString: string | undefined) => {
            if (!timeString) {
              field.onChange(undefined);
              return;
            }

            const [h, m] = timeString.split(":").map(Number);

            let currentDate: Date;
            if (value instanceof Date && !isNaN(field.value.getTime())) {
              currentDate = new Date(field.value);
            } else {
              currentDate = new Date();
            }

            currentDate.setHours(h, m, 0, 0);

            field.onChange(currentDate);
          };

          return (
            <TimePicker
              value={formattedTime}
              onChange={handleTimePickerChange}
              placeholder={placeholder}
              disabled={disabled}
              error={hasError}
              className={className}
              minTime={minTime}
              maxTime={maxTime}
            />
          );
        }}
      />

      {!noErrorMsg && (
        <p
          className={`mt-1 text-sm ${hasError ? "text-red-400" : "text-transparent"}`}
        >
          {errorMessage ?? "\u00A0"}
        </p>
      )}
    </div>
  );
}
