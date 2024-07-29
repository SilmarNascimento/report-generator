import { useEffect, useState } from "react";

export default function useDebounceValue<Type = unknown>(value: Type, delay: number) {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debounceValue;
}