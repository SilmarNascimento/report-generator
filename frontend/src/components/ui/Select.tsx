import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { ComponentProps } from "react";
import { useSearchParams } from "react-router-dom";
import { twMerge } from "tailwind-merge";

export interface SelectProps
  extends ComponentProps<typeof SelectPrimitive.Root> {}

export function Select(props: SelectProps) {
  const [, setSearchParams] = useSearchParams();

  function handleSelectChange(value: string) {
    setSearchParams((params) => {
      params.set("page", "1");
      params.set("pageSize", value);

      return params;
    });
  }
  return <SelectPrimitive.Root {...props} onValueChange={handleSelectChange} />;
}

export interface SelectTriggerProps
  extends ComponentProps<typeof SelectPrimitive.Trigger> {
  children?: never;
}

export function SelectTrigger({ className, ...props }: SelectTriggerProps) {
  const [searchParams] = useSearchParams();
  const pageSize = searchParams.get("pageSize") ?? "10";

  return (
    <SelectPrimitive.Trigger
      className={twMerge(
        "px-3 py-1.5 text-foreground tabular-nums rounded-md border border-input bg-background flex items-center gap-2.5 shadow-xs transition-[color,box-shadow] outline-none focus:border-ring focus:ring-ring/50 focus:ring-[1.5px]",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.Value placeholder={pageSize}>
        {pageSize}
      </SelectPrimitive.Value>

      <SelectPrimitive.Icon className="text-muted-foreground">
        <ChevronDown className="size-4" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export interface SelectContentProps
  extends ComponentProps<typeof SelectPrimitive.Content> {}

export function SelectContent({ className, ...props }: SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        sideOffset={6}
        position="popper"
        className={twMerge(
          "z-50 text-sm max-h-96 min-w-[6rem] overflow-hidden rounded-md border border-border bg-popover shadow-md",
          className,
        )}
        {...props}
      />
    </SelectPrimitive.Portal>
  );
}

export interface SelectItemProps
  extends ComponentProps<typeof SelectPrimitive.Item> {}

export function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      className={twMerge(
        "flex items-center gap-2 text-popover-foreground px-3 py-1.5 justify-between outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>

      <SelectPrimitive.ItemIndicator>
        <Check className="text-primary size-4" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}
