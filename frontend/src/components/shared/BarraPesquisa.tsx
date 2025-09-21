import { ChangeEvent, useRef, useState } from "react";
import { Input } from "../ui/shadcn/input";

type BarraPesquisaProps = {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

const BarraPesquisa = ({
  value,
  onChange,
  placeholder,
}: BarraPesquisaProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleIconClick = () => inputRef.current?.focus();

  return (
    <div
      className={`p-inputgroup mt-2 flex h-10 items-center justify-between rounded-lg border border-[#B4BAC4] transition-shadow duration-200 ${isFocused ? "border-[#0047DB] shadow-[0_0_8px_#99C6FF]" : "shadow-none"} w-full max-w-[532px] md:w-auto`}
    >
      <Input
        ref={inputRef}
        placeholder={placeholder ?? "Consulta sobre"}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="flex-1 !border-none px-4 text-base leading-5 font-normal !ring-0 !outline-none focus-visible:!border-none focus-visible:!ring-0"
      />
      <button
        type="button"
        className="p-inputgroup-addon flex h-10 w-10 cursor-pointer items-center justify-center gap-2.5 rounded p-2.5 text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        onClick={handleIconClick}
        aria-label="Focar no campo de pesquisa"
      >
        <span className="material-symbols-outlined">search</span>
      </button>
    </div>
  );
};

export default BarraPesquisa;
