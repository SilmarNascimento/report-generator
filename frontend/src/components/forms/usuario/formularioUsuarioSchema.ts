import { z } from "zod";

const orgaoSchema = z.object({
  slugOrgao: z.string(),
  nomeOrgao: z.string(),
});

export const formularioUsuarioSchema = z
  .object({
    nomeUsuario: z.string().nonempty("Nome do usuário é obrigatório"),
    emailUsuario: z.string().nonempty("Email do usuário é obrigatório").email(),
    slugOrgaoPadrao: z.string().optional(),
    orgaos: z.array(orgaoSchema).optional(),
    perfilId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const isDefaultCreation =
      (!data.slugOrgaoPadrao || data.slugOrgaoPadrao === "") &&
      (!data.perfilId || data.perfilId === "") &&
      (data.orgaos === undefined || data.orgaos.length === 0);

    if (!isDefaultCreation) {
      if (!data.slugOrgaoPadrao || data.slugOrgaoPadrao === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecione um órgão padrão.",
          path: ["slugOrgaoPadrao"],
        });
      }

      if (!data.perfilId || data.perfilId === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Perfil é obrigatório.",
          path: ["perfilId"],
        });
      }

      if (data.orgaos === undefined || data.orgaos.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Pelo menos um órgão deve ser selecionado.",
          path: ["orgaos"],
        });
      }
    }
  });

export type FormularioUsuarioType = z.infer<typeof formularioUsuarioSchema>;
