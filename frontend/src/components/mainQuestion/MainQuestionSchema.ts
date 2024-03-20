import { z } from 'zod'

function checkFileType(file: File) {
  if (file?.name) {
      const fileType = file.name.split(".").pop();
      if (fileType && ["gif", "png", "jpg"].includes(fileType)) return true; 
  }
  return false;
}

export const fileSchema = z.any()
    .refine(file => file instanceof File, {
      message: 'A file is required',
    })
    .refine((file) => checkFileType(file), "Only .jpg, .gif, .png formats are supported.");

export const subjectSchema = z.object({
  name: z.string().min(3, { message: 'Minimum 3 characters.' }),
});

export const alternativeSchema = z.object({
  id: z.string(),
  description: z.string(),
  images: z.array(fileSchema),
  questionAnswer: z.boolean()
});

export const adaptedQuestionSchema = z.object({
  id: z.string(),
  title: z.string(),
  level: z.string(),
  images: z.array(fileSchema),
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
  title: z.string(),
  subjects: z.array(subjectSchema),
  level: z.string(),
  images: z.array(fileSchema),
  alternatives: z.array(alternativeSchema),
  adaptedQuestions: z.array(adaptedQuestionSchema),
  mockExams: z.array(mockExamSchema),
  handouts: z.array(handoutSchema)
});

export const editMainQuestionSchema = z.object({
  id: z.string(),
  title: z.string(),
  subjects: z.array(subjectSchema),
  level: z.string(),
  images: z.array(fileSchema),
  alternatives: z.array(alternativeSchema),
  adaptedQuestions: z.array(adaptedQuestionSchema),
  mockExams: z.array(mockExamSchema),
  handouts: z.array(handoutSchema)
});
