import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import FullScreenLoader from "@/components/ui/Spinner";
import { NotFoundPage } from "@/pages/NotFoundPage";
// import { requirePermissao } from "@/router/guard";
// import { Permissao } from "@/constants/permissoes";

const EditMainQuestion = lazyRouteComponent(
  () => import("@/pages/main-question/editMainQuestion")
);

export const Route = createFileRoute("/main-questions/edit/$mainQuestionId")({
  //beforeLoad: () => requirePermissao(Permissao.ALTERAR_PERFIL),
  component: EditMainQuestion,
  pendingComponent: () => <FullScreenLoader />,
  errorComponent: () => <NotFoundPage />,
});
