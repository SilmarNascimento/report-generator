import { useState } from "react";
import { Link } from "@tanstack/react-router";
import KeycloakService from "../../service/KeycloakService";
import { useUsuarioStoreSelectors } from "../../store/usuarioStore";
import { CircleUserRound, LogOut, X } from "lucide-react";

const BotaoPerfil = () => {
  const [isOpen, setIsOpen] = useState(false);
  const perfil = { nomePerfil: "Sem perfil" }; //useUsuarioStoreSelectors.use.perfil();
  const nomeUsuario = useUsuarioStoreSelectors.use.nomeUsuario();

  const nomePerfil = perfil?.nomePerfil || "Sem perfil";

  return (
    <div className={`relative inline-block`}>
      <button
        className="cursor-pointer"
        aria-label="Perfil"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CircleUserRound size={30} className="text-2xl text-blue-500" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 z-50 mt-2 w-56 rounded-md border border-gray-300 bg-white p-4 font-sans text-[#2C2E34] shadow-lg">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col">
            <CircleUserRound
              size={30}
              className="mb-2 text-4xl text-blue-500"
            />
            <p className="font-bold">{nomeUsuario}</p>
            <p className={`text-[0.8125rem] font-normal`}>{nomePerfil}</p>
          </div>

          <hr className="my-3 border-gray-300" />

          <Link
            to="/logout"
            className={`flex w-full items-center text-sm font-medium text-red-500 hover:text-red-600`}
            onClick={() => {
              setIsOpen(false);
              KeycloakService.doLogout();
            }}
          >
            <LogOut size={15} className="mr-1.5" />
            Sair
          </Link>
        </div>
      )}
    </div>
  );
};

export default BotaoPerfil;
