import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import FullScreenLoader from "@/components/ui/Spinner";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { z } from "zod";
// import { requirePermissao } from "@/router/guard";
// import { Permissao } from "@/constants/permissoes";

const CreateAdaptedQuestion = lazyRouteComponent(
  () => import("@/pages/main-question/adapted-questions/createAdaptedQuestion")
);

export const Route = createFileRoute(
  "/main-questions/$mainQuestionId/adapted-questions/create/"
)({
  //beforeLoad: () => requirePermissao(Permissao.ALTERAR_PERFIL),
  component: CreateAdaptedQuestion,
  pendingComponent: () => <FullScreenLoader />,
  notFoundComponent: () => <NotFoundPage />,

  params: {
    parse: (params) => ({
      mainQuestionId: z.string().min(1).parse(params.mainQuestionId),
    }),
  },
});
