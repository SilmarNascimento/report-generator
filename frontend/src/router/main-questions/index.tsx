import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import FullScreenLoader from "@/components/ui/Spinner";
import { NotFoundPage } from "@/pages/NotFoundPage";
// import { requirePermissao } from "@/router/guard";
// import { Permissao } from "@/constants/permissoes";

const MainQuestionPage = lazyRouteComponent(
  () => import("@/pages/main-question/MainQuestionsPage")
);

export const Route = createFileRoute()({
  //beforeLoad: () => requirePermissao(Permissao.ALTERAR_PERFIL),
  component: MainQuestionPage,
  pendingComponent: () => <FullScreenLoader />,
  errorComponent: () => <NotFoundPage />,
});
