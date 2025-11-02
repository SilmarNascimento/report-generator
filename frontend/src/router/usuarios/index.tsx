import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import FullScreenLoader from "@/components/ui/Spinner";
import { z } from "zod";
import { requirePermissao } from "@/router/guard";
import { Permissao } from "@/constants/permissoes"; 

const ListagemUsuarios = lazyRouteComponent(
  () => import("@/pages/usuarios/ListagemUsuario"),
);

const searchSchema = z.object({
  pagina_atual: z.coerce.number().int().min(1).catch(1),
  registros_pagina: z.coerce.number().int().min(1).max(100).catch(25),
  ordenacao: z.string().optional(),
  nomeUsuarioOuNomePerfil: z.string().optional(),
});

export type ListagemUsuariosSearchParams = z.infer<typeof searchSchema>;

export const Route = createFileRoute("/usuarios/")({
  beforeLoad: () => requirePermissao(Permissao.LISTAR_USUARIOS),
  component: ListagemUsuarios,
  pendingComponent: () => <FullScreenLoader />,
  validateSearch: (search) => searchSchema.parse(search),
});
