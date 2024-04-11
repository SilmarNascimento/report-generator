import { z } from 'zod'
import { createAlternativeSchema } from '../alternative/AlternativeSchema';

const fileListSchema = z.instanceof(FileList);

export const adaptedQuestionSchema = z.object({
  title: z.string().min(1, { message: "Enunciado é obrigatório" }),
  level: z.enum(["Fácil", "Médio", "Difícil"]),
  images: fileListSchema.optional(),
  alternatives: z.array(createAlternativeSchema),
  questionAnswer: z.string()
});
