import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import FullScreenLoader from "@/components/ui/Spinner";
import { NotFoundPage } from "@/pages/NotFoundPage";
// import { requirePermissao } from "@/router/guard";
// import { Permissao } from "@/constants/permissoes";

const MockExams = lazyRouteComponent(
  () => import("@/pages/mock-exams/mockExamsPage")
);

export const Route = createFileRoute()({
  //beforeLoad: () => requirePermissao(Permissao.ALTERAR_PERFIL),
  component: MockExams,
  pendingComponent: () => <FullScreenLoader />,
  errorComponent: () => <NotFoundPage />,
});
