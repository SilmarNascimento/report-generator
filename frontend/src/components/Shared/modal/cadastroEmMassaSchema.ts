import { z } from "zod";

export const cadastroEmMassaSchema = z.object({
  arquivo: z.instanceof(File, { message: "Selecione a planilha" }),
});

export type CadastroEmMassaFormType = z.infer<typeof cadastroEmMassaSchema>;
