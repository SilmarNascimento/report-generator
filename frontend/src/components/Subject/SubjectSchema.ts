import { z } from "zod";

export const SubjectSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Minimum 3 characters." })
    .transform((name) => {
      return name
        .trim()
        .split(" ")
        .map((word) => {
          return word[0].toUpperCase().concat(word.substring(1).toLowerCase());
        })
        .join(" ");
    }),
  fixedWeight: z.coerce
    .number({ message: "Informe um número válido" })
    .min(0, { message: "O valor mínimo deve ser acima de zero" })
    .max(100, { message: "Ovalor máximo deve ser menor que 100" })
    .transform((val) => Number((val / 100).toFixed(3))),
});
