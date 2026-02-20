import { FormTypes } from "@/interfaces/general";
import { FieldError, FieldErrors } from "react-hook-form";

export function obterValorAninhadoComArray<T extends FormTypes, R = FieldError>(
  errorObj: FieldErrors<T> | undefined,
  path: string,
): R | undefined {
  if (!errorObj) return undefined;

  const keys = path.split(".");
  let current: unknown = errorObj;

  for (const key of keys) {
    if (
      current &&
      typeof current === "object" &&
      !Array.isArray(current) &&
      key in current
    ) {
      current = (current as Record<string, unknown>)[key];
    } else if (Array.isArray(current) && /^\d+$/.test(key)) {
      const index = parseInt(key, 10);
      if (index >= 0 && index < current.length) {
        current = current[index];
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  return current as R | undefined;
}
