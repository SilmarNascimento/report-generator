import { z } from "zod";
import {
  parseDateString,
  dateStrToLocalDate,
} from "@/util/validacoes/date/parsers";

export const createDateSchema = (
  requiredError = "Data obrigatória",
  invalidError = "Data inválida",
) =>
  z
    .string({ required_error: requiredError, invalid_type_error: invalidError })
    .refine((val) => !!val && parseDateString(val) !== null, {
      message: invalidError,
    });

export const createOptionalDateSchema = (invalidError = "Data inválida") =>
  z
    .string()
    .optional()
    .refine((val) => !val || parseDateString(val) !== null, {
      message: invalidError,
    });

export const createDateRangeSchema = (
  requiredErrorFrom = "Data inicial obrigatória",
  invalidErrorFrom = "Data inicial inválida",
  invalidErrorTo = "Data final inválida",
  rangeError = "Data final deve ser posterior à inicial",
) =>
  z
    .object({
      from: createDateSchema(requiredErrorFrom, invalidErrorFrom),
      to: createOptionalDateSchema(invalidErrorTo),
    })
    .refine(
      (data) => {
        const fromDate = dateStrToLocalDate(data.from);
        const toDate = dateStrToLocalDate(data.to);
        if (fromDate && toDate) return toDate >= fromDate;
        return true;
      },
      { message: rangeError, path: ["to"] },
    );

export const createRequiredDateRangeSchema = (
  requiredPeriod = "Período obrigatório",
  requiredErrorFrom = "Data inicial obrigatória",
  invalidErrorFrom = "Data inicial inválida",
  requiredErrorTo = "Data final obrigatória",
  invalidErrorTo = "Data final inválida",
  rangeError = "Data final deve ser posterior à inicial",
) =>
  z
    .object({
      from: createOptionalDateSchema(invalidErrorFrom),
      to: createOptionalDateSchema(invalidErrorTo),
    })
    .superRefine((data, ctx) => {
      const fromDate = data.from ? dateStrToLocalDate(data.from) : undefined;
      const toDate = data.to ? dateStrToLocalDate(data.to) : undefined;

      if (!fromDate && !toDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["from"],
          message: requiredPeriod,
        });
        return;
      }

      if (fromDate && !toDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["to"],
          message: requiredErrorTo,
        });
      }

      if (!fromDate && toDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["from"],
          message: requiredErrorFrom,
        });
      }

      if (fromDate && toDate && toDate < fromDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["to"],
          message: rangeError,
        });
      }
    });
