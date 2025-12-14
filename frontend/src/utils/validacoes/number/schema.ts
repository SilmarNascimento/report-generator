import z, { ZodFirstPartyTypeKind, ZodTypeAny } from "zod";

export function adicionarErro(
  ctx: z.RefinementCtx,
  path: (string | number)[],
  message: string,
) {
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    path: path,
    message: message,
  });
}

export function extractZodMinMax(schema: ZodTypeAny): {
  min?: number;
  max?: number;
} {
  const visited = new Set<ZodTypeAny>();
  const result: { min?: number; max?: number } = {};

  const explore = (node?: ZodTypeAny) => {
    if (!node || visited.has(node)) return;
    visited.add(node);

    const typeName = node._def?.typeName;

    if (typeName === ZodFirstPartyTypeKind.ZodNumber) {
      for (const check of node._def.checks || []) {
        if (check.kind === "min" && result.min === undefined)
          result.min = check.value;
        if (check.kind === "max" && result.max === undefined)
          result.max = check.value;
      }
    }

    const possibleChildren = [
      node._def.innerType,
      node._def.schema,
      node._def.type,
      node._def.unwrap?.(),
    ].filter(Boolean) as ZodTypeAny[];

    for (const child of possibleChildren) explore(child);

    if (
      typeName === ZodFirstPartyTypeKind.ZodUnion &&
      Array.isArray(node._def.options)
    ) {
      for (const opt of node._def.options) explore(opt);
    }
    if (typeName === ZodFirstPartyTypeKind.ZodIntersection) {
      explore(node._def.left);
      explore(node._def.right);
    }
    if (typeName === ZodFirstPartyTypeKind.ZodPipeline) {
      explore(node._def.out);
      explore(node._def.in);
    }
  };

  explore(schema);
  return result;
}

export const createNumericSchema = (
  min: number,
  max: number,
  errorMessage: string,
  allowNegative = true,
) =>
  z.preprocess(
    (val) =>
      val === "" || val === undefined || val === null ? undefined : Number(val),
    z
      .number({
        required_error: errorMessage,
        invalid_type_error: errorMessage,
      })
      .min(min, { message: errorMessage })
      .max(max, { message: errorMessage })
      .int({ message: errorMessage })
      .refine((num) => !isNaN(num), { message: errorMessage })
      .refine((num) => allowNegative || num >= 0, { message: errorMessage }),
  );
