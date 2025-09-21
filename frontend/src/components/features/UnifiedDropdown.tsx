import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/shadcn/input";
import { ChevronDown, Search } from "lucide-react";
import { Button } from "../ui/shadcn/button";
import { DropdownType } from "@/types/general";

type DropdownPropsBasic<T extends DropdownType = DropdownType> = {
  id: string;
  options: T[];
  value: string;
  defaultValue?: string;
  onChange: (item: T) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  dropdownFontSize?: number;
  allowSearch?: false;
};

type DropdownPropsSearch<T extends DropdownType = DropdownType> = {
  id: string;
  options: T[];
  defaultValue?: string;
  queryValue: string;
  onQueryChange: (query: string) => void;
  onChange: (item: T) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  dropdownFontSize?: number;
  allowSearch: true;
};

export type UnifiedDropdownProps<T extends DropdownType = DropdownType> =
  | DropdownPropsBasic<T>
  | DropdownPropsSearch<T>;

export default function UnifiedDropdown<T extends DropdownType = DropdownType>(
  props: UnifiedDropdownProps<T>,
) {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(
    props.allowSearch ? (props.defaultValue ?? "") : "",
  );
  const [previousValueLabel, setPreviousValueLabel] = useState<string | null>(
    props.allowSearch ? (props.defaultValue ?? null) : null,
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownFontText = props.dropdownFontSize
    ? `text-[${props.dropdownFontSize}rem]`
    : "";

  useEffect(() => {
    if (props.allowSearch && props.defaultValue) {
      setInputValue(props.defaultValue);
      setPreviousValueLabel(props.defaultValue);
    }
  }, [props.allowSearch, props.defaultValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);

        if (
          props.allowSearch &&
          inputValue !== previousValueLabel &&
          previousValueLabel
        ) {
          setInputValue(previousValueLabel);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputValue, previousValueLabel, props.allowSearch]);

  const handleFocus = () => {
    setIsFocused(true);
    if (props.allowSearch) {
      setInputValue("");
      props.onQueryChange("");
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (
      props.allowSearch &&
      !(props as DropdownPropsSearch<T>).queryValue &&
      previousValueLabel
    ) {
      setInputValue(previousValueLabel);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (props.allowSearch) {
      const query = event.target.value;
      setInputValue(query);
      (props as DropdownPropsSearch<T>).onQueryChange(query);
    }
  };

  const handleSelect = (item: T) => {
    props.onChange(item);
    setIsFocused(false);

    if (props.allowSearch) {
      setInputValue(item.label);
      setPreviousValueLabel(item.label);
    }
  };

  const handleChevronClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (props.disabled) return;

    setIsFocused((prev) => {
      const next = !prev;

      if (next && props.allowSearch) {
        setInputValue("");
        (props as DropdownPropsSearch<T>).onQueryChange("");
      }

      return next;
    });
  };

  const displayValue = useMemo(() => {
    if (props.allowSearch) {
      return inputValue;
    } else {
      return (
        props.options.find(
          (opt) => opt.value === (props as DropdownPropsBasic<T>).value,
        )?.label || ""
      );
    }
  }, [props, inputValue]);

  const filteredOptions = useMemo(() => {
    if (props.allowSearch) {
      return props.options.filter((opt) =>
        opt.label.toLowerCase().includes(inputValue.toLowerCase()),
      );
    }
    return props.options;
  }, [inputValue, props.options, props.allowSearch]);

  return (
    <div className="relative w-full" ref={containerRef}>
      {props.allowSearch && (
        <Search
          size={18}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-700"
        />
      )}
      <Input
        id={props.id}
        type="text"
        className={`h-10 w-full truncate overflow-hidden rounded-lg border px-3 py-2 pr-10 ${
          props.allowSearch ? "pl-10" : "pl-3"
        } text-base text-ellipsis whitespace-nowrap ${dropdownFontText} ${
          props.error
            ? "border-red-400 text-red-400 placeholder-red-400"
            : "border-gray-300"
        }`}
        value={displayValue}
        onChange={props.allowSearch ? handleInputChange : undefined}
        onFocus={() => !props.disabled && handleFocus()}
        onBlur={handleBlur}
        placeholder={
          props.placeholder ||
          (props.allowSearch ? "Digite para buscar" : "Selecione uma opção")
        }
        readOnly={!props.allowSearch}
        disabled={props.disabled}
      />

      <Button
        type="button"
        className="absolute top-1/2 right-2 z-10 -translate-y-1/2 cursor-pointer bg-transparent! text-gray-700!"
        onMouseDown={handleChevronClick}
      >
        <ChevronDown
          size={18}
          className={`transition-transform ${isFocused ? "rotate-180" : "rotate-0"}`}
        />
      </Button>

      {isFocused && filteredOptions.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-300 bg-white shadow-md">
          {filteredOptions.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                onMouseDown={() => handleSelect(option)}
                className="w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100"
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
