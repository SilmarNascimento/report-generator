import { Checkbox } from "@/components/ui/shadcn/checkbox";
import { Label } from "@/components/ui/shadcn/label";
import { FormTypes } from "@/types/general";
import { Control, Controller, FieldPath } from "react-hook-form";

type InputCheckboxWrapperProps<T extends FormTypes> = {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  isReadOnly?: boolean;
  disabled?: boolean;
  labelFontSize?: number;
};

export function InputCheckboxWrapper<T extends FormTypes>({
  name,
  control,
  label,
  isReadOnly = false,
  disabled = false,
  labelFontSize,
}: Readonly<InputCheckboxWrapperProps<T>>) {
  const fontLabel = `text-[${labelFontSize}rem]`;

  return (
    <div className="flex min-w-[11.25rem] items-center gap-2">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Checkbox
            id={name}
            checked={!!field.value}
            onCheckedChange={field.onChange}
            disabled={isReadOnly || disabled}
          />
        )}
      />
      {label && (
        <Label
          htmlFor={name}
          className={`font-normal ${labelFontSize ? fontLabel : ""} ${
            disabled ? "opacity-60" : "text-gray-800"
          }`}
        >
          {label}
        </Label>
      )}
    </div>
  );
}
