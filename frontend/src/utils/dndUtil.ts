import { FileKind } from "@/interfaces/general";

export function detectFileKind(
  value: File | Blob | string | undefined | null,
): FileKind {
  if (!value) return "other";
  if (value instanceof File) {
    if (
      value.type === "application/pdf" ||
      value.name.toLowerCase().endsWith(".pdf")
    )
      return "pdf";
    if (
      value.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      value.type === "application/vnd.ms-excel" ||
      value.name.toLowerCase().endsWith(".xlsx") ||
      value.name.toLowerCase().endsWith(".xls")
    )
      return "excel";
  }
  if (typeof value === "string") {
    const lower = value.toLowerCase();
    if (lower.includes(".pdf")) return "pdf";
    if (lower.includes(".xlsx") || lower.includes(".xls")) return "excel";
  }
  return "other";
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
