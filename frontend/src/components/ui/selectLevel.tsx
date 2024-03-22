import { useFormContext } from 'react-hook-form';
import { ChangeEvent } from 'react';

interface SelectProps {
  defaultValue?: string;
}

export function SelectLevel ({ defaultValue }: SelectProps) {
  const { register, setValue } = useFormContext();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setValue("level", event.target.value);
  };

  return (
    <select
      {...register('level')}
      defaultValue={defaultValue ?? "Nível da Questão"}
      onChange={handleChange}
      className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-50/50 w-72 text-sm"
    >
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