import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import FullScreenLoader from "@/components/ui/Spinner";
import { visualizacaoUsuarioLoader } from "@/loaders/usuarioLoader";

const VisualizarFormularioUsuario = lazyRouteComponent(
  () => import("@/pages/usuarios/VisualizacaoFormularioUsuario"),
);

export const Route = createFileRoute("/usuarios/visualizar-usuario/$id")({
  component: VisualizarFormularioUsuario,
  loader: visualizacaoUsuarioLoader,
  pendingComponent: () => <FullScreenLoader />,
});
