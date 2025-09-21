import { cn } from "@/lib/utils";
import { FormTypes } from "@/types/general";
import { Controller, Control, FieldErrors, FieldPath } from "react-hook-form";

type InputRadioWrapperProps<T extends FormTypes> = Readonly<{
  name: FieldPath<T>;
  control: Control<T>;
  errors?: FieldErrors<T>;
  value: string;
  label?: string;
  labelClassName?: string;
  isReadOnly?: boolean;
}>;

export function InputRadioWrapper<T extends FormTypes>({
  name,
  value,
  control,
  label,
  labelClassName,
  isReadOnly,
}: Readonly<InputRadioWrapperProps<T>>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id={`${name}-${value}`}
            value={value}
            checked={field.value === value}
            onChange={(e) => {
              if (!isReadOnly) {
                field.onChange(e.target.value);
              }
            }}
            className={`${isReadOnly ? "cursor-default opacity-60" : "cursor-pointer"}`}
          />
          {label && (
            <label
              htmlFor={`${name}-${value}`}
              className={cn("text-sm", labelClassName)}
            >
              {label}
            </label>
          )}
        </div>
      )}
    />
  );
}
