import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import FullScreenLoader from "@/components/ui/Spinner";
import { NotFoundPage } from "@/pages/NotFoundPage";
// import { requirePermissao } from "@/router/guard";
// import { Permissao } from "@/constants/permissoes";

const GenerateDiagnosis = lazyRouteComponent(
  () => import("@/pages/diagnosis/generateDiagnosisPage")
);

export const Route = createFileRoute()({
  //beforeLoad: () => requirePermissao(Permissao.ALTERAR_PERFIL),
  component: GenerateDiagnosis,
  pendingComponent: () => <FullScreenLoader />,
  errorComponent: () => <NotFoundPage />,
});
