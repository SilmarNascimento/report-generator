import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import FullScreenLoader from "@/components/ui/Spinner";
import { NotFoundPage } from "@/pages/NotFoundPage";
// import { requirePermissao } from "@/router/guard";
// import { Permissao } from "@/constants/permissoes";

const DiagnosisPage = lazyRouteComponent(
  () => import("@/pages/diagnosis/diagnosisPage")
);

export const Route = createFileRoute("/diagnosis/")({
  //beforeLoad: () => requirePermissao(Permissao.ALTERAR_PERFIL),
  component: DiagnosisPage,
  pendingComponent: () => <FullScreenLoader />,
  errorComponent: () => <NotFoundPage />,
});
