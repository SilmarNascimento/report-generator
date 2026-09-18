import { useFormContext } from "react-hook-form";
import { getAlternativeLetter } from "../../utils/correctAnswerMapping";

export const AlternativeRadioGroup = () => {
  const { register, watch, setValue } = useFormContext();

  return (
    <div className="flex flex-wrap gap-4">
      {[0, 1, 2, 3, 4].map((index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            {...register("questionAnswer")}
            type="radio"
            id={`questionAnswer${index}`}
            value={`${index}`}
            checked={watch("questionAnswer") === index.toString()}
            onChange={() => setValue("questionAnswer", index.toString())}
            className="accent-primary"
          />
          <label
            htmlFor={`questionAnswer${index}`}
            className="text-sm font-medium cursor-pointer select-none"
          >
            Letra {getAlternativeLetter(index)}
          </label>
        </div>
      ))}
    </div>
  );
};
