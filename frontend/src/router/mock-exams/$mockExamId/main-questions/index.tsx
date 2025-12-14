import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import FullScreenLoader from "@/components/ui/Spinner";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { z } from "zod";
// import { requirePermissao } from "@/router/guard";
// import { Permissao } from "@/constants/permissoes";

const MockExamMainQuestionManager = lazyRouteComponent(
  () => import("@/pages/mock-exams/main-questions/mainQuestionManager")
);

export const Route = createFileRoute("/mock-exams/$mockExamId/main-questions/")(
  {
    //beforeLoad: () => requirePermissao(Permissao.ALTERAR_PERFIL),
    component: MockExamMainQuestionManager,
    pendingComponent: () => <FullScreenLoader />,
    errorComponent: () => <NotFoundPage />,

    validateSearch: z.object({
      page: z.number().catch(1),
      pageSize: z.number().catch(10),
      query: z.string().catch(""),
    }),
  }
);
