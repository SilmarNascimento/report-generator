import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import FullScreenLoader from "@/components/ui/Spinner";
import { NotFoundPage } from "@/pages/NotFoundPage";
// import { requirePermissao } from "@/router/guard";
// import { Permissao } from "@/constants/permissoes";

const MainQuestionIdSubjects = lazyRouteComponent(
  () => import("@/pages/main-question/subject/subjectManager")
);

export const Route = createFileRoute(
  "/main-questions/$mainQuestionId/subjects/"
)({
  //beforeLoad: () => requirePermissao(Permissao.ALTERAR_PERFIL),
  component: MainQuestionIdSubjects,
  pendingComponent: () => <FullScreenLoader />,
  errorComponent: () => <NotFoundPage />,

  params: {
    parse: (params) => ({
      mainQuestionId: params.mainQuestionId,
    }),
  },

  validateSearch: (search: {
    page?: number;
    pageSize?: number;
    query?: string;
  }) => ({
    page: search.page ?? 1,
    pageSize: search.pageSize ?? 10,
    query: search.query ?? "",
  }),
});
