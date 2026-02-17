import { z } from "zod";
import { createCpfSchema } from "@/utils/validacoes/cpf/cpfSchema";
import { CLASS_GROUP } from "@/constants/students";
import { BR_STATES } from "@/constants/general";

export const badgeDropdownSchema = z.object({
  dropdownLabel: z.string().optional(),
  displayLabel: z.string().optional(),
  value: z.enum(CLASS_GROUP),
});

export const studentSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z
    .string()
    .trim()
    .min(1, { message: "E-mail é obrigatório" })
    .pipe(z.email({ message: "E-mail inválido" })),
  cpf: createCpfSchema(),
  enrollmentYear: z.number(),
  classGroups: z
    .array(badgeDropdownSchema)
    .min(1, "Selecione ao menos uma turma"),
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
