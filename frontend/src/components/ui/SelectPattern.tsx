import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { MainQuestionFormType } from "../MainQuestion/MainQuestionSchema";
import { QuestionPattern } from "../../interfaces/MainQuestion";

interface SelectProps {
  defaultValue?: QuestionPattern;
}

const PATTERN_OPTIONS = ["ARITMETICA", "ALGEBRA", "GEOMETRIA"];

export function SelectPattern({ defaultValue }: SelectProps) {
  const { register, setValue, watch } = useFormContext<MainQuestionFormType>();

  const currentValue = watch("pattern");

  useEffect(() => {
    if (defaultValue) {
      setValue("pattern", defaultValue);
    }
  }, [defaultValue, setValue]);

  return (
    <select
      {...register("pattern")}
      defaultValue={defaultValue || ""}
      className={`border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-50/50 w-72 text-sm ${
        !currentValue ? "text-gray-500" : "text-zinc-800"
      }`}
    >
      <option value="" disabled hidden>
        Selecione o padrão da questão
      </option>

      {PATTERN_OPTIONS.map((value) => (
        <option key={value} value={value} className="text-zinc-800">
          {value}
        </option>
      ))}
    </select>
  );
}
