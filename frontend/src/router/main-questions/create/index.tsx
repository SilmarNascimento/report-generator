import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import FullScreenLoader from "@/components/ui/Spinner";
import { NotFoundPage } from "@/pages/NotFoundPage";
// import { requirePermissao } from "@/router/guard";
// import { Permissao } from "@/constants/permissoes";

const CreateMainQuestionPage = lazyRouteComponent(
  () => import("@/pages/main-question/createMainQuestion")
);

export const Route = createFileRoute("/main-questions/create/")({
  //beforeLoad: () => requirePermissao(Permissao.ALTERAR_PERFIL),
  component: CreateMainQuestionPage,
  pendingComponent: () => <FullScreenLoader />,
  notFoundComponent: () => <NotFoundPage />,
});
