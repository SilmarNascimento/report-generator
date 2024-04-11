import { useFormContext } from 'react-hook-form';
import { ChangeEvent, useEffect, useState } from 'react';

interface SelectProps {
  defaultValue?: string;
}

export function SelectLevel ({ defaultValue }: SelectProps) {
  const { register, setValue, watch } = useFormContext();
  const [selectedValue, setSelectedValue] = useState<string | undefined>(defaultValue);

  useEffect(() => {
    if (defaultValue) {
      setValue("level", defaultValue);
      setSelectedValue(defaultValue);
    }
  }, [defaultValue, setValue]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setValue("level", event.target.value);
  };

  const watchedClassName = watch("level");

  useEffect(() => {
    setSelectedValue(watchedClassName);
  }, [watchedClassName]);

  return (
    <select
      {...register('level')}
      value={selectedValue ?? ""}
      onChange={handleChange}
      className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-50/50 w-72 text-sm"
    >
      {!selectedValue && (
        <option value="" disabled hidden>
          Nível da Questão
        </option>
      )}
      <option
        value="Fácil"
        className='text-zinc-800'
      >
        Fácil
      </option>
      <option
        value="Médio"
        className='text-zinc-800'
      >
        Médio
      </option>
      <option
        value="Difícil"
        className='text-zinc-800'
      >
        Difícil
      </option>
    </select>
  );
}