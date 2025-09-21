import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import { Button } from "@/components/ui/shadcn/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Calendar } from "../ui/shadcn/calendar";
import { DateRange, Matcher } from "react-day-picker";
import { formatarPeriodoData } from "@/util/dateUtils";

type DatePickerBaseProps = {
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
};

type DatePickerSingleProps = DatePickerBaseProps & {
  allowRange?: false;
  value?: Date;
  onChange: (date: Date | undefined) => void;
};

type DatePickerRangeProps = DatePickerBaseProps & {
  allowRange: true;
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
};

type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps;

export const DatePicker = ({
  value,
  onChange,
  placeholder = "Selecione uma data",
  disabled = false,
  error = false,
  allowRange = false,
  className,
  minDate,
  maxDate,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const [localRange, setLocalRange] = useState<DateRange | undefined>(
    value as DateRange | undefined,
  );

  let disabledDays: Matcher | undefined = undefined;

  if (minDate && maxDate) {
    disabledDays = { before: minDate, after: maxDate };
  } else if (minDate) {
    disabledDays = { before: minDate };
  } else if (maxDate) {
    disabledDays = { after: maxDate };
  }

  const getStep = (range?: DateRange): number => {
    if (!range?.from) return 0;
    if (range.from && !range.to) return 1;
    return 2;
  };

  const step = getStep(localRange);

  const displayValue = (() => {
    if (allowRange && value) {
      return (
        formatarPeriodoData(localRange?.from, localRange?.to) || placeholder
      );
    }
    if (!allowRange && value instanceof Date && !isNaN(value.getTime())) {
      return format(value, "dd/MM/yyyy");
    }
    return placeholder;
  })();

  const handleSelectDateRange = (date: DateRange | undefined) => {
    if (!date) return;

    if (step === 0 && date.from) {
      const next = { from: date.from, to: undefined };
      setLocalRange(next);
      (onChange as (range: DateRange | undefined) => void)(next);
      return;
    }

    if (step === 1 && date.to) {
      const next = { from: localRange?.from, to: date.to };
      setLocalRange(next);
      (onChange as (range: DateRange | undefined) => void)(next);
      setOpen(false);
      return;
    }

    if (step === 2) {
      let newFrom: Date | undefined = undefined;

      if (
        date.to &&
        (!localRange?.to || date.to.getTime() !== localRange.to.getTime())
      ) {
        newFrom = date.to;
      } else if (
        date.from &&
        (!localRange?.from || date.from.getTime() !== localRange.from.getTime())
      ) {
        newFrom = date.from;
      }

      if (newFrom) {
        const next = { from: newFrom, to: undefined };
        setLocalRange(next);
        (onChange as (range: DateRange | undefined) => void)(next);
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex h-10 w-full justify-between hover:bg-[#F8FAFC] hover:text-[#28272C]",
            !value && "text-muted-foreground",
            error && "border-red-400 text-red-400 placeholder-red-400",
            className,
          )}
          disabled={disabled}
        >
          <div className="flex flex-row justify-start gap-4 text-left font-normal">
            <CalendarIcon className="mr-2 !h-6 !w-6" />
            <span className="flex items-center">{displayValue}</span>
          </div>
          <ChevronDown
            size={18}
            className={`transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        {allowRange ? (
          <Calendar
            mode="range"
            selected={value as DateRange}
            numberOfMonths={2}
            onSelect={handleSelectDateRange}
            disabled={disabledDays}
            autoFocus
          />
        ) : (
          <Calendar
            mode="single"
            selected={value as Date}
            onSelect={(date) => {
              (onChange as (date: Date | undefined) => void)(date);
              setOpen(false);
            }}
            disabled={disabledDays}
            autoFocus
          />
        )}
      </PopoverContent>
    </Popover>
  );
};
