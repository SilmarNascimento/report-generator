import { Controller, Control, FieldPath } from "react-hook-form";
import { FormTypes } from "@/types/general";
import { Label } from "@/components/ui/shadcn/label";
import { Switch } from "@/components/ui/shadcn/switch";

type InputSwitchWrapperProps<T extends FormTypes> = Readonly<{
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  labelFontSize?: string;
  labelLength?: number;
  description?: string;
  handleChange?: VoidFunction;
  isReadOnly?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  labelPosition?: "left" | "right";
}>;

export function InputSwitchWrapper<T extends FormTypes>({
  name,
  control,
  label,
  labelFontSize,
  labelLength,
  description,
  handleChange,
  isReadOnly,
  disabled,
  className,
  labelClassName,
  labelPosition = "left",
}: Readonly<InputSwitchWrapperProps<T>>) {
  const fontDescription = `text-[${labelFontSize}]`;

  const inputId = `${String(name)}`;

  const labelSizeClass = {
    16: "grid-cols-[3.5rem_auto]",
    150: "grid-cols-[9.375rem_auto]",
    200: "grid-cols-[12.5rem_auto]",
    300: "grid-cols-[18.75rem_auto]",
  }[labelLength ?? 300];

  const isLabelRight = labelPosition === "right";

  return (
    <div
      className={`const grid ${labelSizeClass} items-center gap-x-4 gap-y-4 ${
        className ?? ""
      }`}
    >
      {!isLabelRight && (label || description) && (
        <div className="flex flex-col justify-center">
          {label && (
            <Label
              htmlFor={inputId}
              className={`text-sm font-normal ${labelClassName ?? ""}`}
            >
              {label}
            </Label>
          )}
          {description && (
            <span
              className={`text-[0.8125rem] font-normal text-[#7F86A0] ${labelFontSize ? fontDescription : ""}`}
            >
              {description}
            </span>
          )}
        </div>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Switch
            id={inputId}
            checked={!!field.value}
            onCheckedChange={(value) => {
              if (handleChange) handleChange();
              field.onChange(value);
            }}
            disabled={disabled ?? isReadOnly}
          />
        )}
      />

      {isLabelRight && (label || description) && (
        <div className="flex flex-col justify-center">
          {label && (
            <Label
              htmlFor={inputId}
              className={`text-sm font-normal ${labelClassName ?? ""}`}
            >
              {label}
            </Label>
          )}
          {description && (
            <span
              className={`text-[0.8125rem] font-normal text-[#7F86A0] ${labelFontSize ? fontDescription : ""}`}
            >
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
