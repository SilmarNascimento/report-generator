import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { MainQuestionFormType } from "../mainQuestion/mainQuestionSchema";
import { LerikucasType } from "../../interfaces/MainQuestion";

interface SelectProps {
  defaultValue?: LerikucasType;
}

const LERICKUCAS_OPTIONS = Array.from({ length: 8 }, (_, i) => i + 1);

export function SelectLerikucas({ defaultValue }: SelectProps) {
  const { register, setValue, watch } = useFormContext<MainQuestionFormType>();

  const currentValue = watch("lerikucas");

  useEffect(() => {
    if (defaultValue) {
      setValue("lerikucas", defaultValue);
    }
  }, [defaultValue, setValue]);

  return (
    <select
      {...register("lerikucas")}
      defaultValue={defaultValue || ""}
      className={`border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-50/50 w-72 text-sm ${
        !currentValue ? "text-gray-500" : "text-zinc-800"
      }`}
    >
      <option value="" disabled hidden>
        Selecione o Lerickucas
      </option>

      {LERICKUCAS_OPTIONS.map((value) => (
        <option key={value} value={value} className="text-zinc-800">
          {value}
        </option>
      ))}
    </select>
  );
}
