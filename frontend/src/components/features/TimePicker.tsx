import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import { Button } from "@/components/ui/shadcn/button";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type TimePickerProps = {
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  minTime?: string;
  maxTime?: string;
};

export const TimePicker = ({
  value,
  onChange,
  placeholder = "Selecione a hora",
  disabled = false,
  error = false,
  className,
  minTime,
  maxTime,
}: TimePickerProps) => {
  const [open, setOpen] = useState(false);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":").map(Number);
      setHour(h);
      setMinute(m);
    }
  }, [value]);

  const handleTimeChange = (h: number, m: number) => {
    const formatted = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

    if (minTime || maxTime) {
      const current = new Date();
      current.setHours(h, m, 0, 0);

      if (minTime) {
        const [mh, mm] = minTime.split(":").map(Number);
        const minDate = new Date();
        minDate.setHours(mh, mm, 0, 0);
        if (current < minDate) return;
      }

      if (maxTime) {
        const [xh, xm] = maxTime.split(":").map(Number);
        const maxDate = new Date();
        maxDate.setHours(xh, xm, 0, 0);
        if (current > maxDate) return;
      }
    }

    onChange(formatted);
  };

  const incrementHour = () => {
    const newHour = (hour + 1) % 24;
    setHour(newHour);
    handleTimeChange(newHour, minute);
  };

  const decrementHour = () => {
    const newHour = (hour - 1 + 24) % 24;
    setHour(newHour);
    handleTimeChange(newHour, minute);
  };

  const incrementMinute = () => {
    const newMinute = (minute + 1) % 60;
    setMinute(newMinute);
    handleTimeChange(hour, newMinute);
  };

  const decrementMinute = () => {
    const newMinute = (minute - 1 + 60) % 60;
    setMinute(newMinute);
    handleTimeChange(hour, newMinute);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "hover:text-foreground border-input relative h-10 w-full justify-start pr-10 text-left font-normal hover:bg-gray-100!",
            !value && "text-muted-foreground",
            error && "border-red-400 text-red-400 placeholder-red-400",
            className,
          )}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value ?? placeholder}
          <ChevronDown
            size={18}
            className={cn(
              "text-muted-foreground absolute top-1/2 right-2 -translate-y-1/2 text-gray-700! transition-transform",
              open && "rotate-180",
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="z-500 flex w-auto items-center justify-center gap-2 p-4"
        style={{ width: "var(--radix-popover-trigger-width)" }}
        align="start"
      >
        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={incrementHour}
            className="rounded p-1 text-[#0034B7] hover:bg-gray-100"
          >
            <ChevronUp />
          </button>
          <input
            type="number"
            min={0}
            max={23}
            value={String(hour).padStart(2, "0")}
            onChange={(e) => {
              const n = Math.max(0, Math.min(23, Number(e.target.value)));
              setHour(n);
              handleTimeChange(n, minute);
            }}
            onFocus={(e) => e.target.select()}
            className="w-10 rounded border-0 text-center font-mono text-lg text-[#0034B7] focus:border-transparent focus:ring-0 focus:outline-none"
          />
          <button
            type="button"
            onClick={decrementHour}
            className="rounded p-1 text-[#0034B7] hover:bg-gray-100"
          >
            <ChevronDown />
          </button>
        </div>
        <span className="font-mono text-lg">:</span>
        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={incrementMinute}
            className="rounded p-1 text-[#0034B7] hover:bg-gray-100"
          >
            <ChevronUp />
          </button>
          <input
            type="number"
            min={0}
            max={59}
            value={String(minute).padStart(2, "0")}
            onChange={(e) => {
              const n = Math.max(0, Math.min(59, Number(e.target.value)));
              setMinute(n);
              handleTimeChange(hour, n);
            }}
            onFocus={(e) => e.target.select()}
            className="w-10 rounded border-0 text-center font-mono text-lg text-[#0034B7] focus:border-transparent focus:ring-0 focus:outline-none"
          />
          <button
            type="button"
            onClick={decrementMinute}
            className="rounded p-1 text-[#0034B7] hover:bg-gray-100"
          >
            <ChevronDown />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
