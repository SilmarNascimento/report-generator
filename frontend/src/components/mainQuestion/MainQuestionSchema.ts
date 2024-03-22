import { z } from 'zod'

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3;
const fileSchema = z
    .custom<File>(val => val instanceof File, 'Please upload a file')
    .optional()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, 'File size must be less than 3MB');

  const fileListSchema = z.object({
    length: z.number(),
    item: z.function(),
    files: z.array(fileSchema)
  });

export const subjectSchema = z.object({
  name: z.string().min(3, { message: 'Minimum 3 characters.' }),
});

export const alternativeSchema = z.object({
  id: z.string(),
  description: z.string().min(1, { message: 'Descrição da alternativa é obrigatório'}),
  images: fileListSchema,
  questionAnswer: z.boolean()
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
  number: z.number().positive(),
});

export const handoutSchema = z.object({
  id: z.string(),
  title: z.string()
});

export const createMainQuestionSchema = z.object({
  title: z.string().min(1, { message: "Enunciado é obrigatório" }),
  subjects: z.array(subjectSchema),
  level: z.enum(["Fácil", "Médio", "Difícil"]),
  images: fileListSchema,
  alternatives: z.array(alternativeSchema),
  adaptedQuestions: z.array(adaptedQuestionSchema),
  mockExams: z.array(mockExamSchema),
  handouts: z.array(handoutSchema)
});

export const editMainQuestionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, { message: "Enunciado é obrigatório" }),
  subjects: z.array(subjectSchema),
  level: z.enum(["Fácil", "Médio", "Difícil"]),
  images: fileListSchema,
  alternatives: z.array(alternativeSchema),
  adaptedQuestions: z.array(adaptedQuestionSchema),
  mockExams: z.array(mockExamSchema),
  handouts: z.array(handoutSchema)
});
