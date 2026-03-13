export function decodeJwt<T = Record<string, unknown>>(
  token: string,
): T | null {
  try {
    const [, payload] = token.split(".");
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded) as T;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt<{ exp: number }>(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000;
}
