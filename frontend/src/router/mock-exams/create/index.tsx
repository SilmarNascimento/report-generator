import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import FullScreenLoader from "@/components/ui/Spinner";
import { NotFoundPage } from "@/pages/NotFoundPage";
// import { requirePermissao } from "@/router/guard";
// import { Permissao } from "@/constants/permissoes";

const CreateMockExam = lazyRouteComponent(
  () => import("@/pages/mock-exams/createMockExam")
);

export const Route = createFileRoute("/mock-exams/create/")({
  //beforeLoad: () => requirePermissao(Permissao.ALTERAR_PERFIL),
  component: CreateMockExam,
  pendingComponent: () => <FullScreenLoader />,
  notFoundComponent: () => <NotFoundPage />,
});
