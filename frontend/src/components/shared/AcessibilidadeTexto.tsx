import { useFonteStore } from "@/store/useFontStore";

const AcessibilidadeTexto = () => {
  const { fontScale, increaseFontSize, decreaseFontSize, resetFontSize } =
    useFonteStore();

  const MIN_FONT_SCALE_CLASS = 1;
  const MAX_FONT_SCALE_CLASS = 2.2;
  const BUTTON_SIZE = "20px";
  const ICON_SIZE = "!text-[22px]";

  const isMinReached = fontScale === MIN_FONT_SCALE_CLASS;
  const isMaxReached = fontScale === MAX_FONT_SCALE_CLASS;

  return (
    <div className="flex h-[28px] w-[92px] flex-row items-center justify-center gap-[8px] rounded-full bg-[#0034B7]">
      <button
        onClick={decreaseFontSize}
        disabled={isMinReached}
        className={`w-[${BUTTON_SIZE}] h-[${BUTTON_SIZE}] flex items-center justify-center rounded transition-all duration-200 ${
          isMinReached ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        title="Diminuir texto"
      >
        <span
          className={`material-symbols-outlined leading-none text-white ${ICON_SIZE} ${isMinReached ? "opacity-30" : "opacity-100"} `}
        >
          text_decrease
        </span>
      </button>

      <button
        onClick={resetFontSize}
        className={`w-[${BUTTON_SIZE}] h-[${BUTTON_SIZE}] flex cursor-pointer items-center justify-center rounded bg-transparent text-white transition-all duration-200`}
        title="Texto padrão"
      >
        <span
          className={`material-symbols-outlined leading-[18px] text-white ${ICON_SIZE} `}
        >
          text_format
        </span>
      </button>

      <button
        onClick={increaseFontSize}
        disabled={isMaxReached}
        className={`w-[${BUTTON_SIZE}] h-[${BUTTON_SIZE}] flex items-center justify-center rounded transition-all duration-200 ${
          isMaxReached ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        title="Aumentar texto"
      >
        <span
          className={`material-symbols-outlined leading-[18px] text-white ${ICON_SIZE} ${isMaxReached ? "opacity-30" : "opacity-100"} `}
        >
          text_increase
        </span>
      </button>
    </div>
  );
};

export default AcessibilidadeTexto;
