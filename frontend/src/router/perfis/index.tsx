import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { z } from "zod";
// import { requirePermissao } from "@/router/guard";
import FullScreenLoader from "@/components/shared/FullScreanLoader";
// import { Permissao } from "@/constants/permissoes";

const ListagemPerfils = lazyRouteComponent(
  () => import("@/pages/perfis/ListagemPerfil"),
);

const searchSchema = z.object({
  pagina_atual: z.coerce.number().int().min(1).catch(1),
  registros_pagina: z.coerce.number().int().min(1).max(100).catch(25),
  ordenacao: z.string().optional(),
  nomePerfil: z.string().optional(),
});

export const Route = createFileRoute("/perfis/")({
  // beforeLoad: () => requirePermissao(Permissao.LISTAR_PERFIS),
  component: ListagemPerfils,
  pendingComponent: () => <FullScreenLoader />,
  validateSearch: (search) => searchSchema.parse(search),
});
