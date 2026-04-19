import { useState } from "react";
import { useListenForOutsideClicks } from "../../../hooks/useListenForOutsideClicks";
import { ChevronRight } from "lucide-react";
import { Loader } from "../loader/Loader";

type SelectOptionProps = {
  label: string;
  value: string;
};

type SelectProps = {
  options: SelectOptionProps[];
  selected?: SelectOptionProps;
  handleSelect: (option: SelectOptionProps) => void;
  placeholder?: string;
  isFetchingOptions?: boolean;
  lastOptionRef: (node: Element | null) => void;
};

export function InfiniteSelect({
  options,
  selected = { label: "", value: "" },
  placeholder = "Select",
  handleSelect,
  isFetchingOptions,
  lastOptionRef,
}: SelectProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  function openDropdown() {
    setIsDropdownOpen(true);
  }

  function closeDropdown() {
    setIsDropdownOpen(false);
  }

  function labelClassName() {
    return `block max-w-full capitalize truncate ${selected?.label ? "text-gray-900" : "text-gray-400"}`;
  }

  function optionClassName(
    option: SelectOptionProps,
    index: number,
    isSelected: boolean,
  ) {
    isSelected ||= selected?.value === option.value;

    return `active:bg-gray-100 relative cursor-default select-none py-2 px-4 ${
      options.length - 1 === index ? "rounded-b-md" : ""
    } ${isSelected ? "bg-blue-50" : ""} hover:bg-gray-100 mb-1 last-of-type:mb-[0] block text-left w-full`;
  }

  const containerClassName = () => `
    ${
      isDropdownOpen ? "!border-gray-400" : ""
    } px-4 py-2 flex justify-between items-center rounded w-full font-normal border border-solid border-gray-300 bg-white leading-[20px] text-xs text-gray-900 cursor-pointer
    `;

  const { elementRef } = useListenForOutsideClicks(closeDropdown);

  function renderNoOptions() {
    if (isFetchingOptions) return <Loader />;

    return (
      <div className="relative cursor-default select-none py-2 pl-3 pr-9">
        <span className="font-normal block truncate text-sm text-gray-900">
          No options here
        </span>
      </div>
    );
  }

  function renderOptions(options: SelectOptionProps[]) {
    return options?.length > 0
      ? options?.map((option, index) => {
          const isSelected = selected?.value === option.value;

          return (
            <button
              type="button"
              key={String(option.value) + String(index)}
              className={optionClassName(option, index, isSelected)}
              onClick={() => {
                handleSelect(option);
                closeDropdown();
              }}
              ref={options?.length - 1 === index ? lastOptionRef : null}
            >
              <span
                title={option.label}
                className={`${
                  isSelected ? "font-semibold" : "font-normal"
                } block truncate text-gray-900 text-[0.625rem] cursor-pointer leading-[1.2rem]`}
              >
                {option.label}
              </span>
            </button>
          );
        })
      : renderNoOptions();
  }

  return (
    <div className="relative grow">
      <button
        type="button"
        onClick={openDropdown}
        className={containerClassName()}
      >
        <span title={selected?.label} className={labelClassName()}>
          {selected?.label || placeholder}
        </span>
        <span className="pointer-events-none ml-3 flex items-center">
          <ChevronRight
            className={`transition-transform duration-200 ${isDropdownOpen ? "-rotate-90" : "rotate-90"} text-gray-400`}
          />
        </span>
      </button>

      {isDropdownOpen && (
        <div
          className={
            "absolute z-[500] w-full overflow-auto rounded-md bg-white border border-gray-200 py-[8px] text-base ring-opacity-5 focus:outline-none mt-1 max-h-40 shadow-lg"
          }
          ref={elementRef}
        >
          {renderOptions(options)}
        </div>
      )}
    </div>
  );
}
