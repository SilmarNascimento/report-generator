import { z } from "zod";
import {
  LerikucasEnum,
  QuestionLevelEnum,
  QuestionPatternEnum,
} from "@/constants/general";
import { AlternativeSchema } from "../Alternative/AlternativeSchema";

const fileListSchema = z.instanceof(FileList);

const fileSchema = z.instanceof(File).refine((file) => !!file, {
  message: "Arquivo pdf obrigatório",
});

export const MainQuestionSchema = z.object({
  title: z.string().min(1, { message: "Enunciado é obrigatório" }),
  level: z.enum(QuestionLevelEnum),
  lerikucas: z.enum(LerikucasEnum),
  pattern: z.enum(QuestionPatternEnum),
  images: fileListSchema.optional(),
  videoResolutionUrl: z
    .string()
    .min(1, { message: "URL da resolução do vídeo é obrigatória" }),
  alternatives: z.array(AlternativeSchema),
  questionAnswer: z.string(),
  adaptedQuestionsPdfFile: fileSchema,
});

export type MainQuestionFormType = z.infer<typeof MainQuestionSchema>;
