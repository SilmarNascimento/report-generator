import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import FullScreenLoader from "@/components/ui/Spinner";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { z } from "zod";
// import { requirePermissao } from "@/router/guard";
// import { Permissao } from "@/constants/permissoes";

const MockExams = lazyRouteComponent(
  () => import("@/pages/mock-exams/mockExamsPage")
);

export const Route = createFileRoute("/mock-exams/")({
  //beforeLoad: () => requirePermissao(Permissao.ALTERAR_PERFIL),
  component: MockExams,
  pendingComponent: () => <FullScreenLoader />,
  notFoundComponent: () => <NotFoundPage />,

  validateSearch: z.object({
    page: z.number().optional(),
    pageSize: z.number().optional(),
    query: z.string().optional(),
  }),
});
