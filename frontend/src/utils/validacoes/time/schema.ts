import { z } from "zod";

export const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export const createTimeSchema = (
  requiredError = "Horário obrigatório",
  invalidError = "Horário inválido",
) =>
  z
    .string({ required_error: requiredError })
    .trim()
    .refine((value) => /^(\d{1,2}):(\d{1,2})$/.test(value), invalidError)
    .transform((value) => {
      const [hStr, mStr] = value.split(":");
      const h = Number(hStr);
      const m = Number(mStr);

      if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) {
        throw new z.ZodError([
          { code: z.ZodIssueCode.custom, message: invalidError, path: [] },
        ]);
      }

      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    });

export const createOptionalTimeSchema = (invalidError = "Horário inválido") =>
  z
    .string()
    .trim()
    .optional()
    .transform((value) => {
      if (!value) return undefined;

      if (!/^(\d{1,2}):(\d{1,2})$/.test(value)) {
        throw new z.ZodError([
          { code: z.ZodIssueCode.custom, message: invalidError, path: [] },
        ]);
      }

      const [hStr, mStr] = value.split(":");
      const h = Number(hStr);
      const m = Number(mStr);

      if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) {
        throw new z.ZodError([
          { code: z.ZodIssueCode.custom, message: invalidError, path: [] },
        ]);
      }

      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    });

export const createTimeRangeSchema = (
  invalidFrom = "Horário inicial inválido",
  invalidTo = "Horário final inválido",
  rangeError = "Horário final deve ser posterior ao inicial",
) =>
  z
    .object({
      from: createOptionalTimeSchema(invalidFrom),
      to: createOptionalTimeSchema(invalidTo),
    })
    .superRefine((data, ctx) => {
      if (data.from && data.to) {
        const fromMin = timeToMinutes(data.from);
        const toMin = timeToMinutes(data.to);

        if (toMin < fromMin) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: rangeError,
            path: ["to"],
          });
        }
      }
    });

export const createRequiredTimeRangeSchema = (
  requiredRange = "Período obrigatório",
  requiredFrom = "Horário inicial obrigatório",
  invalidFrom = "Horário inicial inválido",
  requiredTo = "Horário final obrigatório",
  invalidTo = "Horário final inválido",
  rangeError = "Horário final deve ser posterior ao inicial",
) =>
  z
    .object({
      from: createTimeSchema(requiredFrom, invalidFrom),
      to: createTimeSchema(requiredTo, invalidTo),
    })
    .superRefine((data, ctx) => {
      if (!data.from && !data.to) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: requiredRange,
          path: ["from"],
        });
        return;
      }

      if (data.from && !data.to) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: requiredTo,
          path: ["to"],
        });
      }

      if (!data.from && data.to) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: requiredFrom,
          path: ["from"],
        });
      }

      if (data.from && data.to) {
        const fromMin = timeToMinutes(data.from);
        const toMin = timeToMinutes(data.to);
        if (toMin < fromMin) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: rangeError,
            path: ["to"],
          });
        }
      }
    });
