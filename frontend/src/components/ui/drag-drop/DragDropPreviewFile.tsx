import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { PdfPreview } from "../PdfPreview";
import { cn } from "@/lib/utils";

type DragDropPreviewFileUploaderProps = {
  formVariable: string;
  message: string;
  url?: string;
};

export function DragDropPreviewFileUploader({
  formVariable,
  message,
  url,
}: DragDropPreviewFileUploaderProps) {
  const { register, setValue, watch } = useFormContext();
  const variableValue = watch(formVariable);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewUrl = useMemo(() => {
    if (!variableValue) {
      return url ?? "";
    }

    return URL.createObjectURL(variableValue);
  }, [url, variableValue]);

  function selectFiles() {
    fileInputRef.current?.click();
  }

  function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    const filesSelected = event.target.files;
    if (!filesSelected || filesSelected?.length === 0) return;

    const newFile = filesSelected.item(0);
    setValue(formVariable, newFile!, { shouldDirty: true });
  }

  function deleteImage() {
    setValue(formVariable, undefined, { shouldDirty: true, shouldTouch: true });
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
    event.dataTransfer.dropEffect = "copy";
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDragDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const filesDropped = event.dataTransfer.files;

    const newFile = filesDropped.item(0);
    setValue(formVariable, newFile!, { shouldDirty: true });
  }

  return (
    <div className="p-4 bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col items-center w-full transition-all">
      <div className="font-bold text-foreground text-center mb-2 font-redhat text-sm">
        <p>{message}</p>
      </div>

      <div className="w-full h-auto flex justify-center items-center flex-wrap max-h-52 overflow-y-auto mt-2.5">
        {previewUrl ? (
          <PdfPreview url={previewUrl} handleDelete={deleteImage} />
        ) : (
          <div
            className={cn(
              "w-full h-40 rounded-lg border-2 border-dashed flex flex-col justify-center items-center select-none transition-all duration-200",
              isDragging
                ? "border-secondary bg-secondary/10 scale-[1.02]"
                : "border-muted-foreground/30 bg-muted/20 hover:border-secondary/50",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDragDrop}
          >
            <div className="flex flex-col items-center gap-2 text-sm">
              {isDragging ? (
                <span className="text-secondary font-bold animate-pulse">
                  Solte o arquivo aqui
                </span>
              ) : (
                <div className="text-muted-foreground text-center px-4">
                  Arraste o arquivo ou{" "}
                  <button
                    type="button"
                    className="text-secondary font-bold hover:underline underline-offset-4"
                    onClick={selectFiles}
                  >
                    procure
                  </button>
                </div>
              )}
            </div>

            <input
              {...register(formVariable)}
              name={formVariable}
              type="file"
              className="file"
              ref={fileInputRef}
              hidden
              accept="image/*,.pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFileSelect}
            />
          </div>
        )}
      </div>
    </div>
  );
}
