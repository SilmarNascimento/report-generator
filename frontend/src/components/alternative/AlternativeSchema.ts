import { z } from "zod";

const fileListSchema = z.instanceof(FileList);

export const alternativeSchema = z.object({
  description: z.string().min(1, { message: 'Descrição da alternativa é obrigatório'}),
  images: fileListSchema.optional(),
});