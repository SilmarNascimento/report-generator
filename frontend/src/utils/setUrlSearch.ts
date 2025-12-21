export type SearchParams = Record<string, string | number>;
export type AnyParams = Record<string, unknown>;
export type Stringificable = string | number | boolean | null | undefined;

export function normalizeToSearchParams(obj: AnyParams): SearchParams {
  const out: SearchParams = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v == null) continue;
    out[k] = String(v);
  }
  return out;
}

export function setUrlSearch(
  setSearchParams: (p: SearchParams) => void,
  current: SearchParams,
  next: Record<string, Stringificable>,
): void;
export function setUrlSearch(
  setSearchParams: (p: SearchParams) => void,
  current: AnyParams,
  next: AnyParams,
): void;

export function setUrlSearch(
  setSearchParams: (p: SearchParams) => void,
  current: AnyParams,
  next: AnyParams,
): void {
  const merged: SearchParams = normalizeToSearchParams(current);

  for (const [k, v] of Object.entries(next)) {
    if (v == null) {
      delete merged[k];
    } else {
      merged[k] = String(v);
    }
  }

  setSearchParams(merged);
}
