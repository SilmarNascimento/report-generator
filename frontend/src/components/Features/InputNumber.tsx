import { cn } from "@/lib/utils";
import { forwardRef, useImperativeHandle, useRef } from "react";

type InputNumberProps = {
  id?: string;
  value?: number | string;
  onChange: (value: number | string) => void;
  hasError?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  hideButtons?: boolean;
  allowNegative?: boolean;
};

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      id,
      value,
      onChange,
      hasError = false,
      placeholder = "-",
      disabled = false,
      className,
      inputClassName,
      hideButtons = false,
      allowNegative = true,
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const numericValue =
      typeof value === "number"
        ? value
        : value === "" || value === undefined || value === null
          ? 0
          : Number(value) || 0;

    const inputValue =
      value === undefined || value === null
        ? ""
        : typeof value === "number"
          ? String(value)
          : value === ""
            ? ""
            : String(value);

    const handleInputChange = (rawValue: string) => {
      if (rawValue === "") {
        onChange("");
        return;
      }
      if (rawValue === "-" && allowNegative) {
        onChange("-");
        return;
      }
      const parsed = parseInt(rawValue.replace(/[^0-9-]/g, ""), 10);
      if (!Number.isNaN(parsed)) onChange(parsed);
    };

    const handleFocus = () => {
      if (inputRef.current) {
        inputRef.current.select();
      }
    };

    return (
      <div
        className={cn(
          "border-input flex h-10 w-fit items-center justify-between rounded-lg border",
          "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[1.5px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          {
            "cursor-default": disabled,
          },
          className,
        )}
        aria-invalid={hasError || undefined}
      >
        <button
          type="button"
          onClick={() =>
            onChange(
              allowNegative ? numericValue - 1 : Math.max(0, numericValue - 1),
            )
          }
          disabled={disabled || (!allowNegative && numericValue <= 0)}
          className={cn("px-3 text-lg text-[#494C57]", {
            "cursor-default": disabled,
            invisible: hideButtons || disabled,
          })}
          aria-label="Diminuir"
        >
          -
        </button>

        <input
          id={id}
          type="text"
          inputMode="numeric"
          ref={inputRef}
          onFocus={handleFocus}
          value={inputValue}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => handleInputChange(e.target.value)}
          className={cn(
            "w-10 bg-transparent text-center outline-none",
            {
              "border-destructive": hasError,
              "opacity-70": disabled,
            },
            inputClassName,
          )}
        />

        <button
          type="button"
          onClick={() => onChange(numericValue + 1)}
          disabled={disabled}
          className={cn("px-3 text-lg text-[#494C57]", {
            "cursor-default": disabled,
            invisible: hideButtons || disabled,
          })}
          aria-label="Aumentar"
        >
          +
        </button>
      </div>
    );
  },
);

InputNumber.displayName = "InputNumber";
