import { z } from "zod";

const fileListSchema = z.instanceof(File).refine((file) => !!file, {
  message: "Arquivo pdf obrigatório",
});

export const mockExamSchema = z.object({
  name: z.string().min(1, { message: "Descrição é obrigatória" }),
  className: z.enum(["Intensivo", "Extensivo"]),
  releasedYear: z.string().refine(
    (year) => {
      const inputYear = Number(year);
      const currentYear = new Date().getFullYear();
      return inputYear > 2021 && inputYear <= currentYear;
    },
    {
      message:
        "O ano de emissão deve ser maior que 2021 e menor ou igual ao ano atual",
    },
  ),
  number: z.string().refine((number) => Number(number) >= 1, {
    message: "O número do simulado deve ser superior a zero",
  }),
  coverPdfFile: fileListSchema,
  matrixPdfFile: fileListSchema,
  answersPdfFile: fileListSchema,
});
