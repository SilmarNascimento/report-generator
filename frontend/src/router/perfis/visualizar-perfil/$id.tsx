import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import FullScreenLoader from "@/components/ui/Spinner";
import { perfilLoader } from "@/loaders/perfilLoader";
import { requirePermissao } from "@/router/guard";
import { Permissao } from "@/constants/permissoes";

const VisualizarPerfil = lazyRouteComponent(
  () => import("@/pages/perfis/VisualizacaoFormularioPerfil"),
);

export const Route = createFileRoute("/perfis/visualizar-perfil/$id")({
  beforeLoad: () => requirePermissao(Permissao.VISUALIZAR_PERFIL),
  component: VisualizarPerfil,
  loader: perfilLoader,
  pendingComponent: () => <FullScreenLoader />,
});
