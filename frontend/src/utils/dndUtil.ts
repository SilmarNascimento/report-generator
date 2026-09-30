import { FileKind } from "@/interfaces/general";

const spreadsheetExtensions = [
  ".xlsx",
  ".xlsm",
  ".xltx",
  ".xltm",
  ".xls",
  ".xlt",
  ".csv",
];

const isSpreadsheetName = (name: string) =>
  spreadsheetExtensions.some((extension) => name.endsWith(extension));

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
      value.type === "text/csv" ||
      isSpreadsheetName(value.name.toLowerCase())
    )
      return "excel";
  }
  if (typeof value === "string") {
    const lower = value.toLowerCase();
    if (lower.includes(".pdf")) return "pdf";
    if (spreadsheetExtensions.some((extension) => lower.includes(extension)))
      return "excel";
  }
  return "other";
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
