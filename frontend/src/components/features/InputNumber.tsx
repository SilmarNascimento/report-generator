import { cn } from "@/lib/utils";

type NumberInputProps = {
  value?: number | string;
  onChange: (value: number | string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
};

export const InputNumber = ({
  value,
  onChange,
  placeholder = "-",
  disabled = false,
  className,
  inputClassName,
}: NumberInputProps) => {
  const current = typeof value === "number" ? value : Number(value) || 0;

  const handleInputChange = (rawValue: string) => {
    if (rawValue === "") {
      onChange("");
    } else {
      const parsed = parseInt(rawValue, 10);
      if (!isNaN(parsed)) onChange(parsed);
    }
  };

  return (
    <div
      className={cn(
        "flex h-10 w-fit items-center justify-between rounded-lg border px-2",
        disabled ? "cursor-not-allowed opacity-60" : "",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onChange(current - 1)}
        disabled={disabled}
        className="px-3 text-lg text-gray-700 disabled:text-gray-400"
      >
        -
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={String(current)}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => handleInputChange(e.target.value)}
        className={cn(
          "w-10 bg-transparent text-center outline-none",
          inputClassName,
        )}
      />
      <button
        type="button"
        onClick={() => onChange(current + 1)}
        disabled={disabled}
        className="px-3 text-lg text-gray-700 disabled:text-gray-400"
      >
        +
      </button>
    </div>
  );
};
