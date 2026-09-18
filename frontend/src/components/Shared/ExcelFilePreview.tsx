import { formatBytes } from "@/utils/dndUtil";
import { FileSpreadsheet } from "lucide-react";

export function ExcelFilePreview({
  file,
  handleDelete,
}: {
  file: File;
  handleDelete?: () => void;
}) {
  return (
    <div className="w-full relative mb-2">
      {handleDelete && (
        <span
          className="absolute -top-1 right-2 text-xl cursor-pointer text-destructive z-10"
          onClick={handleDelete}
        >
          &times;
        </span>
      )}
      <div className="flex flex-col items-center gap-3 p-6 bg-primary/5 border border-primary/20 rounded-lg">
        <FileSpreadsheet className="w-12 h-12 text-primary" />
        <div className="text-center">
          <p className="font-medium text-sm text-foreground truncate max-w-50">
            {file.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatBytes(file.size)}
          </p>
        </div>
      </div>
    </div>
  );
}
