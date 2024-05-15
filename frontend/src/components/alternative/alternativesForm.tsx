import { FieldErrors, useFormContext } from "react-hook-form";
import { z } from 'zod';
import { mainQuestionSchema } from '../mainQuestion/MainQuestionSchema';
import { getAlternativeLetter } from "../../utils/correctAnswerMapping";

type CreateMainQuestionSchema = z.infer<typeof mainQuestionSchema>

interface AlternativeFormProps {
  index: number
  errors: FieldErrors<CreateMainQuestionSchema>
}

export const AlternativeForm = ({ index, errors }: AlternativeFormProps) => {
  const { register, watch, setValue } = useFormContext();

  return (
    <div>
      <div className="space-y-1 flex flex-col justify-center items-start">
        <label htmlFor={`description${index}`}>Descrição</label>
        <textarea
          {...register(`alternatives.${index}.description`)}
          id={`description${index}`}
          placeholder={`Descrição da ${index + 1}ª Alternativa`}
          className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
        />
        <p className={`text-xs ${errors?.alternatives?.[index]?.description ? 'text-red-400' : 'text-transparent'}`}>
          {errors?.alternatives?.[index]?.description?.message ? errors?.alternatives?.[index]?.description?.message : '\u00A0'}
        </p>
      </div>
     
      <div className="space-y-1 flex flex-col justify-center items-start">
        <label htmlFor={`alternatives.${index}.images`} className="font-extralight">Escolha uma imagem</label>
        <input
          {...register(`alternatives.${index}.images`)}
          type="file"
          multiple
          hidden
          accept="image/*,.pdf"
          id={`alternatives.${index}.images`}
        />
        <p className={`text-xs ${errors?.alternatives?.[index]?.images ? 'text-red-400' : 'text-transparent'}`}>
          {errors?.alternatives?.[index]?.images?.message ? errors?.alternatives?.[index]?.images?.message : '\u00A0'}
        </p>
      </div>
  
      <div className="space-y-1 flex flex-col justify-center items-start">
        <div className="flex flex-row justify-start gap-4 items-center">
          <input
            {...register(`questionAnswer`)}
            type="radio"
            id={`questionAnswer${index}`}
            value={`${index}`}
            checked={watch(`questionAnswer`) === index.toString()}
            onChange={() => setValue(`questionAnswer` , index.toString())}
          />
          <label htmlFor={`questionAnswer${index}` }><span className="text-xs font-extralight italic">Resposta correta letra {getAlternativeLetter(index)}</span></label>
        </div>
        <p className={`text-xs ${errors?.questionAnswer ? 'text-red-400' : 'text-transparent'}`}>
          {errors?.questionAnswer?.message ? <span>Defina uma resposta correta</span> : '\u00A0'}
        </p>
      </div>
    </div>
  );
};
