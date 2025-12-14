import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import FullScreenLoader from "@/components/ui/Spinner";

const Login = lazyRouteComponent(() => import("@/pages/Login"));

export const Route = createFileRoute("/login/")({
  //beforeLoad: () => requirePermissao(Permissao.LISTAR_CONFIGURACAO_AGENDAS),
  component: Login,
  pendingComponent: () => <FullScreenLoader />,
});
