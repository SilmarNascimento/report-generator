import { useFormContext } from 'react-hook-form';
import { ChangeEvent } from 'react';

interface SelectProps {
  defaultValue?: string;
}

export function SelectClass ({ defaultValue }: SelectProps) {
  const { register, setValue } = useFormContext();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setValue("className", event.target.value);
  };

  return (
    <select
      {...register('className')}
      defaultValue={defaultValue ?? "Nível da Questão"}
      onChange={handleChange}
      className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-50/50 w-72 text-sm"
    >
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