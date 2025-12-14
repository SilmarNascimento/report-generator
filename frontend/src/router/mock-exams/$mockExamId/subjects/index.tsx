import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import FullScreenLoader from "@/components/ui/Spinner";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { z } from "zod";
// import { requirePermissao } from "@/router/guard";
// import { Permissao } from "@/constants/permissoes";

const MockExamSubjectManager = lazyRouteComponent(
  () => import("@/pages/mock-exams/subject/subjectManager")
);

export const Route = createFileRoute("/mock-exams/$mockExamId/subjects/")({
  //beforeLoad: () => requirePermissao(Permissao.ALTERAR_PERFIL),
  component: MockExamSubjectManager,
  pendingComponent: () => <FullScreenLoader />,
  notFoundComponent: () => <NotFoundPage />,

  validateSearch: z.object({
    page: z.number().catch(1),
    pageSize: z.number().catch(10),
    query: z.string().catch(""),
  }),
});
