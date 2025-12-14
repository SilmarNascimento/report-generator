import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import FullScreenLoader from "@/components/ui/Spinner";
import { NotFoundPage } from "@/pages/NotFoundPage";
// import { requirePermissao } from "@/router/guard";
// import { Permissao } from "@/constants/permissoes";

const CreateAdaptedQuestion = lazyRouteComponent(
  () => import("@/pages/main-question/adapted-questions/createAdaptedQuestion")
);

export const Route = createFileRoute("/main-questions/$mainQuestionId/adapted-questions/create/")({
  //beforeLoad: () => requirePermissao(Permissao.ALTERAR_PERFIL),
  component: CreateAdaptedQuestion,
  pendingComponent: () => <FullScreenLoader />,
  errorComponent: () => <NotFoundPage />,
});
