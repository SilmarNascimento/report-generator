import { useFormContext, useWatch } from "react-hook-form";
import { useMemo } from "react";
import isEqual from "lodash.isequal";

export function useIsPristine<T extends object>() {
  const { control, formState } = useFormContext<T>();

  const currentValues = useWatch({ control });

  const defaultValues = formState.defaultValues;

  const isPristine = useMemo(() => {
    if (!defaultValues) {
      return false;
    }

    return isEqual(currentValues, defaultValues);
  }, [currentValues, defaultValues]);

  return isPristine;
}
