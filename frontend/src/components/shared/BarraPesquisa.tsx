import { ChangeEvent, useRef } from "react";
import { Input } from "../ui/shadcn/input";
import { cn } from "@/lib/utils";

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

  const handleIconClick = () => inputRef.current?.focus();

  return (
    <div
      className={cn(
        "mt-2 flex h-10 w-full max-w-[532px] items-center rounded-lg",
        "border-input border bg-transparent",
        "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[1.5px]",
        "transition-[border,box-shadow]",
      )}
    >
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder ?? "Consulta sobre"}
        className={cn(
          "text-base leading-[1.5] font-normal",
          "h-full flex-1 rounded-none border-none shadow-none",
          "focus-visible:border-none focus-visible:ring-0",
        )}
      />
      <button
        type="button"
        onClick={handleIconClick}
        aria-label="Focar no campo de pesquisa"
        className={cn(
          "text-muted-foreground flex h-10 w-10 items-center justify-center",
          "hover:text-foreground",
          "focus:outline-none focus-visible:ring-0",
        )}
      >
        <span className="material-symbols-outlined">search</span>
      </button>
    </div>
  );
};

export default BarraPesquisa;
