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
      className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-50/50 w-72 text-sm"
    >
      <option
        value="10"
        className='text-zinc-800'
      >
        10
      </option>
      <option
        value="20"
        className='text-zinc-800'
      >
        20
      </option>
      <option
        value="50"
        className='text-zinc-800'
      >
        50
      </option>
    </select>
  );
}