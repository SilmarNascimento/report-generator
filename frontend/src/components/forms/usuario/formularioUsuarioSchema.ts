import { z } from "zod";

export const formularioUsuarioSchema = z.object({
  nomeUsuario: z.string().min(1, "Nome do usuário é obrigatório"),
  cpf: z.string(),
  emailUsuario: z.string().nonempty("Email do usuário é obrigatório").email(),
  turma: z.string().min(1, "Turma é obrigatório"),
  anoMatricula: z.string().min(1, "Turma é obrigatório"),
  dataAtivacao: z.string().min(1, "Selecione a data de ativação"),
  perfilId: z.string().optional(),
  foto: z.string().optional(),
  endereco: z.string().optional(),
});

export type FormularioUsuarioType = z.infer<typeof formularioUsuarioSchema>;

// super refine para deixar os campos turma, ano matricula e data de ativação opcional se o tipo de usuário for um professor.
