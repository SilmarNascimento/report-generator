import { z } from 'zod'
import { alternativeSchema } from '../alternative/AlternativeSchema';

const fileListSchema = z.instanceof(FileList);

export const mainQuestionSchema = z.object({
  title: z.string().min(1, { message: "Enunciado é obrigatório" }),
  level: z.enum(["Fácil", "Médio", "Difícil"]),
  images: fileListSchema.optional(),
  alternatives: z.array(alternativeSchema),
  questionAnswer: z.string()
});

