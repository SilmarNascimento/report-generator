import { z } from 'zod'

const fileListSchema = z.instanceof(FileList);

export const createAlternativeSchema = z.object({
  description: z.string().min(1, { message: 'Descrição da alternativa é obrigatório'}),
  images: fileListSchema.optional()
});

export const mainQuestionSchema = z.object({
  title: z.string().min(1, { message: "Enunciado é obrigatório" }),
  level: z.enum(["Fácil", "Médio", "Difícil"]),
  images: fileListSchema.optional(),
  alternatives: z.array(createAlternativeSchema),
  questionAnswer: z.string()
});

