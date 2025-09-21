import { useUsuarioStore } from "@/store/usuarioStore";
import { UsuarioPorCpfType } from "@/types/users";
import { mapUsuarioPorCpfParaUsuarioGlobal } from "@/util/usuarioMapper";
import apiService from "./BackofficeApiService";


export const atualizarUsuarioGlobal = async () => {
  const { setUsuario } = useUsuarioStore.getState();

  try {
    const resposta = await apiService.post<UsuarioPorCpfType>(`/usuario`, {});
    const usuarioAtualizado = mapUsuarioPorCpfParaUsuarioGlobal(resposta);

    if (usuarioAtualizado) {
      setUsuario(usuarioAtualizado);
    }
  } catch (error) {
    console.error("Erro ao atualizar usuário", error);
  }
};