import { Control, Controller, FieldErrors, useFormContext } from "react-hook-form";
import { z } from 'zod';
import { createMainQuestionSchema } from './mainQuestion/MainQuestionSchema';

type CreateMainQuestionSchema = z.infer<typeof createMainQuestionSchema>

interface AlternativeFormProps {
  index: number
  control: Control<CreateMainQuestionSchema>
  errors: FieldErrors<CreateMainQuestionSchema>
}

export const AlternativeForm = ({ index, control, errors }: AlternativeFormProps) => {
  const { register } = useFormContext();
  return (
    <div>
      <Controller
        name={`alternatives.${index}.description`}
        control={control}
        render={({ field }) => (
          <div className="space-y-2 flex flex-col justify-center items-start">
            <label htmlFor={`description${index}`}>Descrição</label>
            <textarea
              {...register(`alternatives.${index}.description`)}
              id={`description${index}`}
              {...field}
              placeholder={`Descrição da ${index + 1}ª Alternativa`}
              className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
            />
            <p className={`text-sm ${errors?.alternatives?.[index]?.description ? 'text-red-400' : 'text-transparent'}`}>
              {errors?.alternatives?.[index]?.description?.message ? errors?.alternatives?.[index]?.description?.message : '\u00A0'}
            </p>
          </div>
        )}
      />

      <Controller
        name={`alternatives.${index}.images`}
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <div className="space-y-2 flex flex-col justify-center items-start">
            <label htmlFor={`questionAnswer${index}`} className="font-extralight">Escolha uma imagem</label>
            <input type="file" {...field} multiple id={`questionAnswer${index}`} />
            <p className={`text-sm ${errors?.alternatives?.[index]?.images ? 'text-red-400' : 'text-transparent'}`}>
              {errors?.alternatives?.[index]?.images?.message ? errors?.alternatives?.[index]?.images?.message : '\u00A0'}
            </p>
          </div>
        )}
      />

      <Controller
        name={`alternatives.${index}.questionAnswer`}
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <div className="space-y-2 flex flex-col justify-center items-start">
            <div className="flex flex-row justify-start gap-4 items-center">
              <input type="radio" {...field} id={`questionAnswer${index}`} name="questionAnswer" value={index}/>
              <label htmlFor={`questionAnswer${index}`}>Resposta</label>
            </div>
            <p className={`text-sm ${errors?.alternatives?.[index]?.questionAnswer ? 'text-red-400' : 'text-transparent'}`}>
              {errors?.alternatives?.[index]?.questionAnswer?.message ? errors?.alternatives?.[index]?.questionAnswer?.message : '\u00A0'}
            </p>
          </div>
        )}
      />
    </div>
  );
};
