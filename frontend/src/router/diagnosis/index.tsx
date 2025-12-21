import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import FullScreenLoader from "@/components/ui/Spinner";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { z } from "zod";
// import { requirePermissao } from "@/router/guard";
// import { Permissao } from "@/constants/permissoes";

const DiagnosisPage = lazyRouteComponent(
  () => import("@/pages/diagnosis/diagnosisPage")
);

const diagnosisSearchSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(10),
  query: z.string().optional().default(""),
});

export const Route = createFileRoute("/diagnosis/")({
  //beforeLoad: () => requirePermissao(Permissao.ALTERAR_PERFIL),
  component: DiagnosisPage,
  pendingComponent: () => <FullScreenLoader />,
  errorComponent: () => <NotFoundPage />,
  validateSearch: diagnosisSearchSchema,
});
