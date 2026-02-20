export const captalizarNome = (nome: string) => {
  const palavrasMinusculas = new Set([
    "de",
    "da",
    "das",
    "do",
    "dos",
    "e",
    "a",
    "o",
    "as",
    "os",
    "em",
    "com",
    "por",
    "para",
    "se",
    "sem",
    "sob",
    "sobre",
  ]);

  return nome
    .toLowerCase()
    .split(" ")
    .map((palavra, index) =>
      palavrasMinusculas.has(palavra) && index !== 0
        ? palavra
        : palavra.charAt(0).toUpperCase() + palavra.slice(1),
    )
    .join(" ");
};

export function formatCpf(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);
}

export function formatTelefone(value: string): string {
  const numbers = value.replace(/\D/g, "").slice(0, 11);
  return numbers
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{1})(\d{4})(\d{4})$/, "$1 $2-$3");
}

export const formatters = {
  cpf: {
    format: formatCpf,
    normalize: (v: string) => v.replace(/\D/g, "").slice(0, 11),
  },
  telefone: {
    format: formatTelefone,
    normalize: (v: string) => v.replace(/\D/g, "").slice(0, 11),
  },
};

export const removerDuplicatasDeLista = (
  str?: string,
  separador = ", ",
): string => {
  if (!str) return "";

  const listaUnica = Array.from(new Set(str.split(",").map((s) => s.trim())));

  return listaUnica.join(separador);
};
