import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import { FormTypes } from "@/types/general";
import { obterValorAninhadoComArray } from "@/util/errorParser";
import { Controller, Control, FieldPath, FieldErrors } from "react-hook-form";

type InputSwitchWrapperProps<T extends FormTypes> = Readonly<{
  name: FieldPath<T>;
  control: Control<T>;
  errors?: FieldErrors<T>;
  label: string;
  labelFontSize?: number;
  placeholder?: string;
  isReadOnly?: boolean;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  noErrorMsg?: boolean;
}>;

export function InputPenaltyNumberWrapper<T extends FormTypes>({
  name,
  control,
  errors,
  label,
  labelFontSize,
  placeholder,
  isReadOnly,
  disabled,
  className,
  inputClassName,
  noErrorMsg = false,
}: Readonly<InputSwitchWrapperProps<T>>) {
  const fontLabel = `text-[${labelFontSize}]`;
  const fieldError = obterValorAninhadoComArray(errors, name);
  const hasError = !!fieldError;

  const inputId = `${String(name)}`;

  return (
    <>
      <div
        className={`grid grid-cols-[36rem_auto] gap-x-4 gap-y-4 ${
          className ?? ""
        }`}
      >
        <div className="flex flex-col justify-center">
          {label && (
            <Label
              htmlFor={inputId}
              className={`text-base font-normal ${labelFontSize ? fontLabel : ""}`}
            >
              {label}
            </Label>
          )}
        </div>

        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <div className="flex flex-col md:w-full xl:w-25">
              <Input
                id={inputId}
                {...field}
                type="number"
                placeholder={placeholder ?? ""}
                value={field.value ? Number(field.value) : ""}
                className={`border-input h-10 w-full rounded-lg border font-normal ${className ?? ""} ${inputClassName ?? ""}`}
                onChange={(e) => field.onChange(e.target.value)}
                disabled={disabled ?? isReadOnly}
              />
            </div>
          )}
        />
      </div>

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
