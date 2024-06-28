import { z } from 'zod'
import { alternativeSchema } from '../alternative/AlternativeSchema';

const fileListSchema = z.instanceof(FileList);

const fileSchema = z.instanceof(File)
  .refine((file) => !!file,
  { 
    message: "Arquivo pdf obrigatório" 
  });

export const mainQuestionSchema = z.object({
  title: z.string().min(1, { message: "Enunciado é obrigatório" }),
  level: z.enum(["Fácil", "Médio", "Difícil"]),
  images: fileListSchema.optional(),
  videoResolutionUrl: z.string().min(1, { message: "URL da resolução do vídeo é obrigatória" }),
  alternatives: z.array(alternativeSchema),
  questionAnswer: z.string(),
  adaptedQuestionsPdfFile: fileSchema
});

