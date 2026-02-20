import { z } from 'zod'
import { AlternativeSchema } from '../Alternative/AlternativeSchema';

const fileListSchema = z.instanceof(FileList);

export const AdaptedQuestionSchema = z.object({
  title: z.string().min(1, { message: "Enunciado é obrigatório" }),
  level: z.enum(["Fácil", "Médio", "Difícil"]),
  images: fileListSchema.optional(),
  alternatives: z.array(AlternativeSchema),
  questionAnswer: z.string()
});
