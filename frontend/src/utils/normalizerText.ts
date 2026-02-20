export const normalizeText = (text: string | undefined | null): string => {
  if (!text || !text.trim()) return "";

  return text
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .toLowerCase()
    .trim();
};