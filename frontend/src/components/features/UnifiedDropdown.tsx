import { ChangeEvent, useMemo, useState } from "react";
import { Input } from "@/components/ui/shadcn/input";
import { ChevronDown, Search } from "lucide-react";
import { Button } from "../ui/shadcn/button";
import { cn } from "@/lib/utils";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { DropdownType } from "@/interfaces/general";
import { normalizeText } from "@/utils/normalizerText";

export type UnifiedDropdownProps<T extends DropdownType = DropdownType> = {
  id: string;
  options: T[];
  value: string;
  onChange: (item: T) => void;
  queryValue?: string;
  onQueryChange?: (query: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  disabledOptions?: string[];
  allowSearch?: boolean;
  className?: string;
};

export default function UnifiedDropdown<T extends DropdownType>(
  props: UnifiedDropdownProps<T>,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [persistedSelection, setPersistedSelection] = useState<T | null>(null);

  const isSearchControlled =
    props.queryValue !== undefined && props.onQueryChange !== undefined;

  const effectiveSearchTerm = isSearchControlled
    ? props.queryValue!
    : searchValue;

  const selectedOption = useMemo(() => {
    const found = props.options.find((opt) => opt.value === props.value);
    if (found) return found;

    if (persistedSelection && persistedSelection.value === props.value) {
      return persistedSelection;
    }

    return null;
  }, [persistedSelection, props.options, props.value]);

  const displayValue =
    props.allowSearch && isOpen
      ? effectiveSearchTerm
      : selectedOption?.label ?? "";

  const filteredOptions = useMemo(() => {
    if (isSearchControlled) return props.options;

    if (!props.allowSearch || !effectiveSearchTerm) return props.options;

    const normalizedSearch = normalizeText(effectiveSearchTerm);

    return props.options.filter((opt) =>
      normalizeText(opt.label).includes(normalizedSearch),
    );
  }, [
    isSearchControlled,
    props.options,
    props.allowSearch,
    effectiveSearchTerm,
  ]);

  const { refs, floatingStyles, context } = useFloating({
    placement: "bottom-start",
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(4),
      flip(),
      shift(),
      size({
        apply({ rects, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${Math.min(availableHeight, 260)}px`,
            overflowY: "auto",
          });
        },
      }),
    ],
  });

  const dismiss = useDismiss(context);
  const { getFloatingProps } = useInteractions([dismiss]);

  const openDropdown = () => {
    if (props.disabled) return;

    setSearchValue("");
    props.onQueryChange?.("");
    setIsOpen(true);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!props.allowSearch) return;

    const query = event.target.value;

    if (isSearchControlled) {
      props.onQueryChange?.(query);
    } else {
      setSearchValue(query);
    }
  };

  const handleSelect = (item: T) => {
    setPersistedSelection(item);
    props.onChange(item);

    setIsOpen(false);

    setTimeout(() => {
      props.onChange(item);
    }, 0);

    if (isSearchControlled) {
      props.onQueryChange?.("");
    } else {
      setSearchValue("");
    }
  };

  const handleChevronClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (props.disabled) return;

    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setSearchValue("");
        props.onQueryChange?.("");
      }
      return next;
    });
  };

  return (
    <div ref={refs.setReference} className="relative w-full">
      {props.allowSearch && (
        <Search
          size={18}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
        />
      )}

      <Input
        id={props.id}
        value={displayValue}
        onChange={handleInputChange}
        onFocus={openDropdown}
        readOnly={!props.allowSearch}
        disabled={props.disabled}
        placeholder={props.placeholder}
        aria-invalid={props.error || undefined}
        className={cn(
          "text-sm leading-[1.5] font-normal text-[#28272C]",
          "h-10 w-full rounded-lg border px-3 pr-10",
          props.allowSearch ? "pl-10" : "pl-3",
          props.className,
        )}
      />

      <Button
        type="button"
        onClick={handleChevronClick}
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-transparent shadow-none hover:bg-transparent"
      >
        <ChevronDown
          size={18}
          className={cn("text-[#28272C] transition-transform", {
            "rotate-180": isOpen,
          })}
        />
      </Button>

      {isOpen && filteredOptions.length > 0 && (
        <ul
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="z-50 rounded-lg border bg-white shadow-md"
        >
          {filteredOptions.map((option) => {
            const isDisabled = props.disabledOptions?.includes(option.value);

            return (
              <li key={option.value}>
                <button
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "text-sm leading-[1.5] font-normal text-[#28272C]",
                    "w-full px-4 py-2 text-left hover:bg-gray-100",
                    isDisabled && "cursor-not-allowed opacity-70",
                    props.className,
                  )}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
