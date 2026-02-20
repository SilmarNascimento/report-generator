import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

interface TableProps extends ComponentProps<"table"> {}

export function Table(props: TableProps) {
  return (
    <div className="relative w-full overflow-auto">
      <table
        {...props}
        className={twMerge(
          "w-full text-sm border-y-2 border-border bg-background",
          props.className,
        )}
      />
    </div>
  );
}

interface TableHeaderProps extends ComponentProps<"thead"> {}

export function TableHeader(props: TableHeaderProps) {
  return (
    <thead
      {...props}
      className={twMerge("bg-muted/50 font-redhat", props.className)}
    />
  );
}

interface TableHeadProps extends ComponentProps<"th"> {}

export function TableHead(props: TableHeadProps) {
  return (
    <th
      {...props}
      className={twMerge(
        "text-center py-3 px-4 font-bold uppercase text-xs text-muted-foreground tracking-wider",
        props.className,
      )}
    />
  );
}

interface TableBodyProps extends ComponentProps<"tbody"> {}

export function TableBody(props: TableBodyProps) {
  return (
    <tbody
      {...props}
      className={twMerge(
        "text-center [&_tr:last-child]:border-0 [&_tr:hover]:bg-muted/50 transition-colors even:bg-muted/20",
        props.className,
      )}
    />
  );
}

interface TableRowProps extends ComponentProps<"tr"> {}

export function TableRow(props: TableRowProps) {
  return (
    <tr
      {...props}
      className={twMerge(
        "border-b border-border transition-colors",
        props.className,
      )}
    />
  );
}

interface TableCellProps extends ComponentProps<"td"> {}

export function TableCell(props: TableCellProps) {
  return (
    <td
      {...props}
      className={twMerge("py-3 px-4 text-foreground/80", props.className)}
    />
  );
}
