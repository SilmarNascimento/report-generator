import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { MainQuestionFormType } from "../MainQuestion/MainQuestionSchema";
import { LevelType } from "../../interfaces/MainQuestion";

const LEVEL_OPTIONS: LevelType[] = ["Fácil", "Médio", "Difícil"];

interface SelectProps {
  defaultValue?: LevelType;
}

export function SelectLevel({ defaultValue }: SelectProps) {
  const { register, setValue, watch } = useFormContext<MainQuestionFormType>();

  const currentValue = watch("level");

  useEffect(() => {
    if (defaultValue) {
      setValue("level", defaultValue);
    }
  }, [defaultValue, setValue]);

  return (
    <select
      {...register("level")}
      defaultValue={defaultValue || ""}
      className={`border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-50/50 w-72 text-sm ${
        !currentValue ? "text-gray-500" : "text-zinc-800"
      }`}
    >
      <option value="" disabled hidden>
        Nível da Questão
      </option>

      {LEVEL_OPTIONS.map((option) => (
        <option key={option} value={option} className="text-zinc-800">
          {option}
        </option>
      ))}
    </select>
  );
}
