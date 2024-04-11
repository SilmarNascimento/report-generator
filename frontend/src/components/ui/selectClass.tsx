import { useFormContext } from 'react-hook-form';
import { ChangeEvent, useEffect, useState } from 'react';

interface SelectProps {
  defaultValue?: string;
}

export function SelectClass ({ defaultValue }: SelectProps) {
  const { register, setValue, watch } = useFormContext();
  const [selectedValue, setSelectedValue] = useState<string | undefined>(defaultValue);

  useEffect(() => {
    if (defaultValue) {
      setValue('className', defaultValue);
      setSelectedValue(defaultValue);
    }
  }, [defaultValue, setValue]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setValue("className", event.target.value);
  };

  const watchedClassName = watch('className');

  useEffect(() => {
    setSelectedValue(watchedClassName);
  }, [watchedClassName]);

  return (
    <select
      {...register('className')}
      value={selectedValue ?? ""}
      onChange={handleChange}
      className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-50/50 w-72 text-sm"
    >
      {!selectedValue && (
        <option value="" disabled hidden>
          Turma
        </option>
      )}
      <option
        value="Intensivo"
        className='text-zinc-800'
      >
        Intensivo
      </option>
      <option
        value="Extensivo"
        className='text-zinc-800'
      >
        Extensivo
      </option>
    </select>
  );
}