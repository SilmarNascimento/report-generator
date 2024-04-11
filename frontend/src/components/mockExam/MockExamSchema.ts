import { z } from "zod";

export const mockExamSchema = z.object({
  name: z.string().min(1, { message: "Descrição é obrigatória" }),
  className: z.enum(["Intensivo", "Extensivo"]),
  releasedYear: z.string(),
  number: z.string(),
});