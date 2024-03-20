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
        defaultValue=""
        render={({ field }) => (
          <input {...field} placeholder={`Descrição da ${index + 1}ª Alternativa`} />
        )}
      />
      {errors.alternatives?.[index]?.description && <span>Este campo é obrigatório</span>}

      <Controller
        name={`alternatives.${index}.images`}
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <input type="file" {...field} multiple />
        )}
      />

      <Controller
        name={`alternatives.${index}.questionAnswer`}
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <div>
            <label>
              <input type="radio" {...field} name="questionAnswer" value={index}/>
              Correta
            </label>
          </div>
        )}
      />
      {errors.alternatives?.[index]?.questionAnswer && <span>{errors?.alternatives[index]?.questionAnswer?.message}</span>}
    </div>
  );
};

// { errors.alternatives?.[index]?.images
//   &&
//   errors.alternatives?.[index]?.images.map((error, i) => (
//     <span key={i}>{error?.message}</span>
//   )
// )}