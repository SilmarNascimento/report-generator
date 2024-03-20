import { Control, Controller, FieldErrors } from "react-hook-form";
import { z } from 'zod';
import { createMainQuestionSchema } from './mainQuestion/MainQuestionSchema';

type CreateMainQuestionSchema = z.infer<typeof createMainQuestionSchema>

interface AlternativeFormProps {
  index: number
  control: Control<CreateMainQuestionSchema>
  errors: FieldErrors<CreateMainQuestionSchema>
}

export const AlternativeForm = ({ index, control, errors }: AlternativeFormProps) => {
  return (
    <div>
      <Controller
        name={`alternatives.${index}.description`}
        control={control}
        render={({ field }) => (
          <div>
            <label htmlFor={`description${index}`}>Descrição</label>
            <input
              id={`description${index}`}
              {...field}
              placeholder={`Descrição da ${index + 1}ª Alternativa`}
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
          <div>
            <label htmlFor={`questionAnswer${index}`}>Escolha uma imagem</label>
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
          <div>
            <label htmlFor={`questionAnswer${index}`}>Resposta</label>
            <input type="radio" {...field} id={`questionAnswer${index}`} name="questionAnswer" value={index}/>
            <p className={`text-sm ${errors?.alternatives?.[index]?.questionAnswer ? 'text-red-400' : 'text-transparent'}`}>
              {errors?.alternatives?.[index]?.questionAnswer?.message ? errors?.alternatives?.[index]?.questionAnswer?.message : '\u00A0'}
            </p>
          </div>
        )}
      />
    </div>
  );
};
