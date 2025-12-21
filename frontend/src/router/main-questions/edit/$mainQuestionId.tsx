import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import FullScreenLoader from "@/components/ui/Spinner";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { z } from "zod";
// import { requirePermissao } from "@/router/guard";
// import { Permissao } from "@/constants/permissoes";

const EditMainQuestion = lazyRouteComponent(
  () => import("@/pages/main-question/editMainQuestion")
);

export const Route = createFileRoute("/main-questions/edit/$mainQuestionId")({
  //beforeLoad: () => requirePermissao(Permissao.ALTERAR_PERFIL),
  component: EditMainQuestion,
  pendingComponent: () => <FullScreenLoader />,
  notFoundComponent: () => <NotFoundPage />,

  params: {
    parse: (params) => ({
      mainQuestionId: z.string().min(1).parse(params.mainQuestionId),
    }),
  },
});
