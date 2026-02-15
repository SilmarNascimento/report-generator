import { z } from "zod";
import { createCpfSchema } from "@/utils/validacoes/cpf/cpfSchema";
import { CLASS_GROUP } from "@/constants/students";
import { BR_STATES } from "@/constants/general";

export const studentSchema = z.object({
  name: z.string(),
  email: z
    .string()
    .trim()
    .min(1, { message: "E-mail é obrigatório" })
    .pipe(z.email({ message: "E-mail inválido" })),
  cpf: createCpfSchema(),
  enrollmentYear: z.number(),
  classGroup: z.enum(CLASS_GROUP),
  photoUrl: z.string().optional(),
  address: z
    .object({
      street: z.string().optional(),
      number: z.number().optional(),
      complement: z.string().optional(),
      neighborhood: z.string().optional(),
      city: z.string().optional(),
      state: z.enum(BR_STATES).optional(),
      zipCode: z.string().optional(),
    })
    .optional(),
});

export type StudentFormType = z.infer<typeof studentSchema>;
