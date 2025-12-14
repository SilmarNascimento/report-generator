import { create } from "zustand";
import { createSelectors } from "./createSelectors";

type BarraNavegacaoStateType = {
  navegacaoExpandida: boolean;
  setNavegacaoExpandida: () => void;
};

const useBarraNavegacaoStore = create<BarraNavegacaoStateType>((set) => ({
  navegacaoExpandida: true,
  setNavegacaoExpandida: () =>
    set((state) => ({
      navegacaoExpandida: !state.navegacaoExpandida,
    })),
}));

export const useBarraNavegacaoStoreSelectors = createSelectors(
  useBarraNavegacaoStore,
);
