import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import FullScreenLoader from "@/components/ui/Spinner";
import { NotFoundPage } from "@/pages/NotFoundPage";
// import { requirePermissao } from "@/router/guard";
// import { Permissao } from "@/constants/permissoes";

const EditMockExam = lazyRouteComponent(
  () => import("@/pages/mock-exams/editMockExam")
);

export const Route = createFileRoute("/mock-exams/response/$studentResponseId")({
  //beforeLoad: () => requirePermissao(Permissao.ALTERAR_PERFIL),
  component: EditMockExam,
  pendingComponent: () => <FullScreenLoader />,
  notFoundComponent: () => <NotFoundPage />,
});
