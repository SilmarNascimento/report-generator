import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import FullScreenLoader from "@/components/ui/Spinner";
import { NotFoundPage } from "@/pages/NotFoundPage";
// import { requirePermissao } from "@/router/guard";
// import { Permissao } from "@/constants/permissoes";

const MockExamSubjectManager = lazyRouteComponent(
  () => import("@/pages/mock-exams/subject/subjectManager")
);

export const Route = createFileRoute()({
  //beforeLoad: () => requirePermissao(Permissao.ALTERAR_PERFIL),
  component: MockExamSubjectManager,
  pendingComponent: () => <FullScreenLoader />,
  errorComponent: () => <NotFoundPage />,
});
