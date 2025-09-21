import {
  useState,
  useRef,
  useEffect,
  useMemo,
  ChangeEvent,
  useCallback,
} from "react";
import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";
import { ChevronDown, Search, X } from "lucide-react";
import { BadgeDropdownType } from "@/types/general";
import { Badge } from "../ui/shadcn/badge";
import { cn } from "@/lib/utils";

type MultiSelectDropdownProps<T extends BadgeDropdownType> = {
  id: string;
  options: T[];
  value: T[];
  onChange: (values: T[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  dropdownFontSize?: number;
  allowSearch?: boolean;
  showBadges?: boolean;
  queryValue?: string;
  onQueryChange?: (query: string) => void;
};

export default function MultiSelectDropdown<T extends BadgeDropdownType>({
  id,
  options,
  value,
  onChange,
  placeholder = "Selecione...",
  disabled = false,
  error = false,
  dropdownFontSize,
  allowSearch = false,
  showBadges = false,
  queryValue,
  onQueryChange,
}: MultiSelectDropdownProps<T>) {
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [overflow, setOverflow] = useState(false);
  const selectedRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isSearchControlled =
    queryValue !== undefined && onQueryChange !== undefined;
  const effectiveSearchTerm = isSearchControlled ? queryValue! : searchTerm;

  const dropdownFontText = dropdownFontSize
    ? `text-[${dropdownFontSize}rem]`
    : "";

  const safeValue = useMemo<T[]>(() => {
    return Array.isArray(value) ? value : [];
  }, [value]);

  const selectedOptions = useMemo(
    () => options.filter((opt) => safeValue.some((v) => v.value === opt.value)),
    [safeValue, options],
  );

  const filteredOptions = useMemo(() => {
    if (!allowSearch || !effectiveSearchTerm) return options;
    return options.filter((opt) =>
      opt.dropdownLabel
        .toLowerCase()
        .includes(effectiveSearchTerm.toLowerCase()),
    );
  }, [effectiveSearchTerm, options, allowSearch]);

  const toggleOption = useCallback(
    (option: T) => {
      const exists = safeValue.some((v) => v.value === option.value);
      const newValue = exists
        ? safeValue.filter((v) => v.value !== option.value)
        : [...safeValue, option];

      onChange(newValue);
    },
    [onChange, safeValue],
  );

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsFocused(false);
    }
  };

  useEffect(() => {
    if (!containerRef.current || !selectedRef.current) return;

    const checkOverflow = () => {
      const containerWidth = containerRef.current!.offsetWidth;
      const contentWidth = selectedRef.current!.scrollWidth;
      setOverflow(contentWidth > containerWidth - 40);
    };

    checkOverflow();

    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [selectedOptions]);

  const renderBadge = useCallback(
    () =>
      overflow ? (
        <Badge
          variant="outline"
          className="bg-secondary flex h-7 items-center gap-1 rounded-full px-2 py-0.5 text-white"
        >
          <span className="text-xs leading-6 font-normal">
            {selectedOptions.length > 1
              ? `${selectedOptions.length} itens selecionados`
              : "1 item selecionado"}
          </span>
        </Badge>
      ) : (
        <div ref={selectedRef} className="flex flex-wrap gap-1">
          {selectedOptions.map((opt) => (
            <Badge
              key={opt.value}
              variant="outline"
              className="bg-secondary flex h-7 items-center gap-1 rounded-full px-2 py-0.5 text-white"
            >
              <span className="text-xs leading-6 font-normal">
                {opt.displayLabel ?? opt.dropdownLabel}
              </span>
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleOption(opt);
                }}
                className="h-4 w-4 bg-transparent p-0! hover:bg-transparent"
              >
                <X size={16} className="hover:text-destructive text-white" />
              </Button>
            </Badge>
          ))}
        </div>
      ),
    [overflow, selectedOptions, toggleOption],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayValue = useMemo(() => {
    if (showBadges && selectedOptions.length > 0) {
      return "";
    }
    return selectedOptions.map((opt) => opt.dropdownLabel).join(", ");
  }, [selectedOptions, showBadges]);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        id={id}
        tabIndex={disabled ? -1 : 0}
        className={cn(
          "flex h-10 w-full min-w-0 items-center gap-1 rounded-lg border bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow] outline-none",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1.5px]",
          "focus:border-ring focus:ring-ring/50 focus:ring-[1.5px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          dropdownFontText,
          error
            ? "border-red-400 text-red-400 placeholder-red-400"
            : "border-input",
          disabled
            ? "pointer-events-none cursor-not-allowed opacity-90"
            : "cursor-pointer",
          showBadges && selectedOptions.length > 0 ? "flex-wrap" : "",
        )}
        onClick={() => !disabled && setIsFocused((prev) => !prev)}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            setIsFocused((prev) => !prev);
          }
        }}
      >
        {showBadges && selectedOptions.length > 0 ? (
          renderBadge()
        ) : (
          <span
            className={cn(
              "text-sm leading-6 font-normal",
              "truncate",
              selectedOptions.length === 0 && "text-muted-foreground",
            )}
          >
            {displayValue || placeholder}
          </span>
        )}
      </div>

      <Button
        type="button"
        className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer bg-transparent! text-gray-700!"
        onMouseDown={(e) => {
          e.preventDefault();
          if (!disabled) setIsFocused((prev) => !prev);
        }}
      >
        <ChevronDown
          size={18}
          className={`transition-transform ${isFocused ? "rotate-180" : "rotate-0"}`}
        />
      </Button>

      {isFocused && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-300 bg-white shadow-md">
          {allowSearch && (
            <div className="p-2">
              <div className="relative w-full">
                <Search
                  size={18}
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-700"
                />
                <Input
                  type="text"
                  placeholder="Buscar..."
                  value={effectiveSearchTerm}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (isSearchControlled) {
                      onQueryChange?.(e.target.value);
                    } else {
                      setSearchTerm(e.target.value);
                    }
                  }}
                  className="pl-9"
                />
              </div>
            </div>
          )}
          <ul>
            {filteredOptions.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  className={`flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 ${
                    safeValue.some((v) => v.value === option.value)
                      ? "bg-gray-50 font-medium"
                      : ""
                  }`}
                  onMouseDown={() => toggleOption(option)}
                >
                  <input
                    type="checkbox"
                    checked={value.some((v) => v.value === option.value)}
                    readOnly
                  />
                  {option.dropdownLabel}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
