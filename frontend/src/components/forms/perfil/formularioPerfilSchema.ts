import { z } from "zod";

const sectionSchema = z.object({
  tituloSessao: z.string(),
  opcoesPermissao: z.array(
    z.object({
      name: z.string(),
      checked: z.boolean(),
    }),
  ),
});
export type SessaoPerfilType = z.infer<typeof sectionSchema>;

export const formularioPerfilSchema = z.object({
  nomePerfil: z.string().min(1, "Nome do Perfil é obrigatório"),
  permissoes: z.array(sectionSchema),
});

export type FormularioPerfilType = z.infer<typeof formularioPerfilSchema>;
