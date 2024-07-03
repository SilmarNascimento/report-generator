import { z } from "zod";

const fileSchema = z.instanceof(File)
  .refine((file) => !!file,
  { 
    message: "Arquivo de respostas dos alunos obrigatório" 
  });

export const studentRecordsSchema = z.object({
  studentRecordsExcelFile: fileSchema,
  mockExamSelected: z.object({
    label: z.string(),
    value: z.string()
  })
});