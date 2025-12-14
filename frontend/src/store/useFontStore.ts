import { create } from "zustand";

const fontScaleArray = [1, 1.2, 1.4, 1.6, 1.8, 2, 2.2];
const defaultIndex = 3;

type FonteStore = {
  index: number;
  fontScale: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
};

export const useFonteStore = create<FonteStore>((set) => ({
  index: defaultIndex,
  fontScale: fontScaleArray[defaultIndex],

  increaseFontSize: () =>
    set((state) => {
      const newIndex =
        state.index < fontScaleArray.length - 1 ? state.index + 1 : state.index;
      return {
        index: newIndex,
        fontScale: fontScaleArray[newIndex],
      };
    }),

  decreaseFontSize: () =>
    set((state) => {
      const newIndex = state.index > 0 ? state.index - 1 : state.index;
      return {
        index: newIndex,
        fontScale: fontScaleArray[newIndex],
      };
    }),

  resetFontSize: () =>
    set({ index: defaultIndex, fontScale: fontScaleArray[defaultIndex] }),
}));
