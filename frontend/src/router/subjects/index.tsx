import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import FullScreenLoader from "@/components/ui/Spinner";
// import { requirePermissao } from "@/router/guard";
// import { Permissao } from "@/constants/permissoes";

const Subjects = lazyRouteComponent(() => import("@/pages/subject/Subjects"));

export const Route = createFileRoute("/subjects/")({
  //beforeLoad: () => requirePermissao(Permissao.ALTERAR_PERFIL),
  component: Subjects,
  pendingComponent: () => <FullScreenLoader />,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      page: typeof search.page === "number" ? search.page : 1,
      pageSize: typeof search.pageSize === "number" ? search.pageSize : 10,
      query: typeof search.query === "string" ? search.query : "",
    };
  },
});
