import { z } from "zod";

const fileSchema = z.instanceof(File).refine((file) => !!file, {
  message: "Arquivo obrigatório",
});

export const studentRecordsSchema = z.object({
  studentRecordsExcelFile: fileSchema,
  mockExamSelected: z.object({
    label: z.string(),
    value: z.string(),
  }),
});

export const responseStatusSchema = z.object({
  studentRecord: fileSchema,
});

export type StudentDiagnosisStatusFormType = z.infer<
  typeof responseStatusSchema
>;

export type GenerateStudentsResponseFormType = z.infer<
  typeof studentRecordsSchema
>;
