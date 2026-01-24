import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import FullScreenLoader from "@/components/ui/Spinner";
// import { requirePermissao } from "@/router/guard";
// import { Permissao } from "@/constants/permissoes";

const NovoPerfil = lazyRouteComponent(
  () => import("@/pages/perfis/NovoFormularioPerfil"),
);

export const Route = createFileRoute("/perfis/novo-perfil")({
  // beforeLoad: () => requirePermissao(Permissao.CRIAR_PERFIL),
  component: NovoPerfil,
  pendingComponent: () => <FullScreenLoader />,
});
