import { ChangeEvent, useEffect, useState } from 'react';

interface SelectProps {
  defaultValue?: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
}

export function SelectPageSize ({ defaultValue, setPageSize }: SelectProps) {
  const [selectedValue, setSelectedValue] = useState<number | undefined>(defaultValue);

  useEffect(() => {
    if (defaultValue) {
      setPageSize(defaultValue);
      setSelectedValue(defaultValue);
    }
  }, [defaultValue, setPageSize]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
    setSelectedValue(Number(event.target.value));
  };

  return (
    <select
      value={selectedValue ?? ""}
      onChange={handleChange}
      className="border border-input rounded-lg px-3 py-2.5 bg-background text-foreground w-72 text-sm shadow-xs outline-none focus:border-ring focus:ring-ring/50 focus:ring-[1.5px] transition-[color,box-shadow]"
    >
      <option value="10">10</option>
      <option value="20">20</option>
      <option value="50">50</option>
    </select>
  );
}