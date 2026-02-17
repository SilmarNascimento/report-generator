import { z } from "zod";
import { alternativeSchema } from "../alternative/AlternativeSchema";
import {
  LerikucasEnum,
  QuestionLevelEnum,
  QuestionPatternEnum,
} from "@/constants/general";

const fileListSchema = z.instanceof(FileList);

const fileSchema = z.instanceof(File).refine((file) => !!file, {
  message: "Arquivo pdf obrigatório",
});

export const mainQuestionSchema = z.object({
  title: z.string().min(1, { message: "Enunciado é obrigatório" }),
  level: z.enum(QuestionLevelEnum),
  lerikucas: z.enum(LerikucasEnum),
  pattern: z.enum(QuestionPatternEnum),
  images: fileListSchema.optional(),
  videoResolutionUrl: z
    .string()
    .min(1, { message: "URL da resolução do vídeo é obrigatória" }),
  alternatives: z.array(alternativeSchema),
  questionAnswer: z.string(),
  adaptedQuestionsPdfFile: fileSchema,
});

export type MainQuestionFormType = z.infer<typeof mainQuestionSchema>;
