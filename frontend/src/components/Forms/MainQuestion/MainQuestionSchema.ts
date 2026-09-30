import { z } from "zod";
import {
  LerikucasEnum,
  QuestionLevelEnum,
  QuestionPatternEnum,
} from "@/constants/general";

const fileSchema = z.instanceof(File).refine((file) => !!file, {
  message: "Arquivo pdf obrigatório",
});

const subjectOptionSchema = z.object({
  value: z.string(),
  dropdownLabel: z.string(),
  displayLabel: z.string(),
});

export const MainQuestionSchema = z.object({
  title: z.string().min(1, { message: "Enunciado é obrigatório" }),
  level: z.enum(QuestionLevelEnum),
  lerikucas: z.enum(LerikucasEnum),
  pattern: z.enum(QuestionPatternEnum),
  videoResolutionUrl: z
    .string()
    .min(1, { message: "URL da resolução do vídeo é obrigatória" }),
  questionAnswer: z.string(),
  adaptedQuestionsPdfFile: fileSchema,
  mainSubject: z.string().optional().refine((val) => !!val, {
    message: "Assunto principal é obrigatório",
  }),
  secondarySubjects: z.array(subjectOptionSchema),
});

export type MainQuestionFormType = z.infer<typeof MainQuestionSchema>;
