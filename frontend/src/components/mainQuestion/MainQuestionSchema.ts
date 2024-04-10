import { z } from 'zod'

const fileListSchema = z.instanceof(FileList);

export const subjectSchema = z.object({
  name: z.string().min(3, { message: 'Minimum 3 characters.' }),
});

export const alternativeSchema = z.object({
  id: z.string(),
  description: z.string().min(1, { message: 'Descrição da alternativa é obrigatório'}),
  images: fileListSchema.optional(),
  questionAnswer: z.boolean()
});

export const createAlternativeSchema = z.object({
  description: z.string().min(1, { message: 'Descrição da alternativa é obrigatório'}),
  images: fileListSchema.optional()
});

export const adaptedQuestionSchema = z.object({
  id: z.string(),
  title: z.string(),
  level: z.string(),
  images: fileListSchema,
  alternatives: z.array(alternativeSchema)
});

export const mockExamSchema = z.object({
  id: z.string(),
  name: z.string(),
  className: z.array(z.string()),
  subjects: z.array(subjectSchema),
  releasedYear: z.number().positive(),
  number: z.number().positive(),
});

export const handoutSchema = z.object({
  id: z.string(),
  title: z.string()
});

export const createMainQuestionSchema = z.object({
  title: z.string().min(1, { message: "Enunciado é obrigatório" }),
  level: z.enum(["Fácil", "Médio", "Difícil"]),
  images: fileListSchema.optional(),
  alternatives: z.array(createAlternativeSchema),
  questionAnswer: z.string()
});

export const editMainQuestionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, { message: "Enunciado é obrigatório" }),
  level: z.enum(["Fácil", "Médio", "Difícil"]),
  images: fileListSchema.optional(),
  alternatives: z.array(createAlternativeSchema),
  questionAnswer: z.string()
});

export const editMainQuestionForm = z.object({
  title: z.string().min(1, { message: "Enunciado é obrigatório" }),
  level: z.enum(["Fácil", "Médio", "Difícil"]),
  images: fileListSchema.optional(),
  alternatives: z.array(createAlternativeSchema),
  questionAnswer: z.string()
});
