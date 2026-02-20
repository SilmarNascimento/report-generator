import { z } from "zod";

const fileListSchema = z.instanceof(FileList);

export const AlternativeSchema = z.object({
  description: z.string().min(1, { message: 'Descrição da alternativa é obrigatório'}),
  images: fileListSchema.optional(),
});