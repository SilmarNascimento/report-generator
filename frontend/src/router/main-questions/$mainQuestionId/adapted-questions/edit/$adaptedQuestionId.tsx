import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import FullScreenLoader from "@/components/ui/Spinner";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { z } from "zod";
// import { requirePermissao } from "@/router/guard";
// import { Permissao } from "@/constants/permissoes";

const EditAdaptedQuestion = lazyRouteComponent(
  () => import("@/pages/main-question/adapted-questions/editAdaptedQuestion")
);

export const Route = createFileRoute(
  "/main-questions/$mainQuestionId/adapted-questions/edit/$adaptedQuestionId"
)({
  //beforeLoad: () => requirePermissao(Permissao.ALTERAR_PERFIL),
  component: EditAdaptedQuestion,
  pendingComponent: () => <FullScreenLoader />,
  notFoundComponent: () => <NotFoundPage />,

  params: {
    parse: (params) => ({
      mainQuestionId: z.string().min(1).parse(params.mainQuestionId),
      adaptedQuestionId: z.string().min(1).parse(params.adaptedQuestionId),
    }),
  },
});
