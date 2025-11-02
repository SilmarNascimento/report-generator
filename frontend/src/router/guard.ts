import { Permissao } from "@/constants/permissoes";
import { router } from "@/router/router";
import { useUsuarioStore } from "@/store/usuarioStore";
import { redirect } from "@tanstack/react-router";

type ValidPath = Parameters<typeof router.navigate>[0]["to"];

const HOME_PATH: ValidPath = "/dashboard/";

function getPermSet() {
  const perms = useUsuarioStore.getState().perfil.permissoes as
    | Permissao[]
    | undefined;

  return new Set(perms ?? []);
}

export function requirePermissao(p: Permissao) {
  const set = getPermSet();
  const hasPerm = set.has(p);

  if (!hasPerm) {
    throw redirect({ to: HOME_PATH, replace: true });
  }
}

export function requireAlgumaPermissao(ps: Permissao[]) {
  const set = getPermSet();
  const ok = ps.some((p) => set.has(p));

  if (!ok) {
    throw redirect({ to: HOME_PATH, replace: true });
  }
}

export function requireTodasPermissoes(ps: Permissao[]) {
  const set = getPermSet();
  const ok = ps.every((p) => set.has(p));

  if (!ok) {
    throw redirect({ to: HOME_PATH, replace: true });
  }
}
