import { z } from "zod";

export const subjectSchema = z.object({
  name: z.string().min(3, { message: 'Minimum 3 characters.' }),
});

export const mockExamSchema = z.object({
  id: z.string(),
  name: z.string(),
  className: z.enum(["Intensivo", "Extensivo"]),
  subjects: z.array(subjectSchema),
  releasedYear: z.number().positive(),
  number: z.number().positive(),
});

export const mockExamForm = z.object({
  name: z.string(),
  className: z.enum(["Intensivo", "Extensivo"]),
  releasedYear: z.string(),
  number: z.string(),
});