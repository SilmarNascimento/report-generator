import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import FullScreenLoader from "@/components/ui/Spinner";
import { NotFoundPage } from "@/pages/NotFoundPage";
// import { requirePermissao } from "@/router/guard";
// import { Permissao } from "@/constants/permissoes";
import { z } from "zod";

const MainQuestionPage = lazyRouteComponent(
  () => import("@/pages/main-question/MainQuestionsPage")
);

const searchSchema = z.object({
  query: z.string().optional().default(""),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(10),
});

export const Route = createFileRoute("/main-questions/")({
  //beforeLoad: () => requirePermissao(Permissao.ALTERAR_PERFIL),
  component: MainQuestionPage,
  pendingComponent: () => <FullScreenLoader />,
  errorComponent: () => <NotFoundPage />,

  validateSearch: (search) => searchSchema.parse(search),
});
