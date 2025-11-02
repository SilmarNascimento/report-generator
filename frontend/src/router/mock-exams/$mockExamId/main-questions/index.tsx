import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import FullScreenLoader from "@/components/ui/Spinner";
import { NotFoundPage } from "@/pages/NotFoundPage";
// import { requirePermissao } from "@/router/guard";
// import { Permissao } from "@/constants/permissoes";

const MockExamMainQuestionManager = lazyRouteComponent(
  () => import("@/pages/mock-exams/main-questions/mainQuestionManager")
);

export const Route = createFileRoute()({
  //beforeLoad: () => requirePermissao(Permissao.ALTERAR_PERFIL),
  component: MockExamMainQuestionManager,
  pendingComponent: () => <FullScreenLoader />,
  errorComponent: () => <NotFoundPage />,
});
