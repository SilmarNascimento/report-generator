import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import FullScreenLoader from "@/components/ui/Spinner";
import { editarUsuarioLoader } from "@/loaders/usuarioLoader";
// import { requirePermissao } from "@/router/guard";
// import { Permissao } from "@/constants/permissoes";

const EditarFormularioUsuario = lazyRouteComponent(
  () => import("@/pages/usuarios/EditarFormularioUsuario"),
);

export const Route = createFileRoute("/usuarios/editar-usuario/$id")({
  // beforeLoad: () => requirePermissao(Permissao.ALTERAR_USUARIO),
  component: EditarFormularioUsuario,
  loader: editarUsuarioLoader,
  pendingComponent: () => <FullScreenLoader />,
});
