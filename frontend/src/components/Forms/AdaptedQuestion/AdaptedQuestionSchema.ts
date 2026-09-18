import { z } from "zod";

export const AdaptedQuestionSchema = z.object({
  title: z.string().min(1, { message: "Enunciado é obrigatório" }),
  level: z.enum(["Fácil", "Médio", "Difícil"]),
  questionAnswer: z.string(),
});

export type AdaptedQuestionFormType = z.infer<typeof AdaptedQuestionSchema>;
