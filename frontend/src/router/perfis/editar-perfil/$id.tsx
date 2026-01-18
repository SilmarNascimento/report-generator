import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import FullScreenLoader from "@/components/ui/Spinner";
import { perfilLoader } from "@/loaders/perfilLoader";
import { requirePermissao } from "@/config/_guard";
import { Permissao } from "@/constants/permissoes";

const EditarPerfil = lazyRouteComponent(
  () => import("@/pages/perfis/EditarFormularioPerfil"),
);

export const Route = createFileRoute("/perfis/editar-perfil/$id")({
  beforeLoad: () => requirePermissao(Permissao.ALTERAR_PERFIL),
  component: EditarPerfil,
  loader: perfilLoader,
  pendingComponent: () => <FullScreenLoader />,
});
