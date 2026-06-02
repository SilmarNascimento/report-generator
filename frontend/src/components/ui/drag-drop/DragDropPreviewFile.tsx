import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { PdfPreview } from "../PdfPreview";
import { cn } from "@/lib/utils";
import { DEFAULT_FILE_ACCEPT } from "@/constants/general";
import { detectFileKind } from "@/utils/dndUtil";
import { ExcelFilePreview } from "@/components/Shared/ExcelFilePreview";

type DragDropPreviewFileUploaderProps = {
  formVariable: string;
  message: string;
  url?: string;
  alwaysShowDropZone?: boolean;
  fullHeight?: boolean;
  accept?: string;
};

export function DragDropPreviewFileUploader({
  formVariable,
  message,
  url,
  alwaysShowDropZone = false,
  fullHeight = false,
  accept = DEFAULT_FILE_ACCEPT,
}: DragDropPreviewFileUploaderProps) {
  const { register, setValue, watch } = useFormContext();
  const variableValue = watch(formVariable);
  const { ref: registerRef, ...rest } = register(formVariable);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [previewWidth, setPreviewWidth] = useState<number>(0);

  const fileKind = detectFileKind(
    variableValue instanceof File ? variableValue : url,
  );

  useEffect(() => {
    if (!variableValue) {
      setPreviewUrl(url ?? "");
      return;
    }

    if (!(variableValue instanceof File || variableValue instanceof Blob))
      return;

    const objectUrl = URL.createObjectURL(variableValue);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [variableValue, url]);

  useEffect(() => {
    if (!contentRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setPreviewWidth(Math.floor(entry.contentRect.width));
      }
    });
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, []);

  function selectFiles() {
    fileInputRef.current?.click();
  }

  function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    const filesSelected = event.target.files;
    if (!filesSelected || filesSelected.length === 0) return;

    const newFile = filesSelected.item(0);
    setValue(formVariable, newFile!, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function deleteFile() {
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
    const newFile = event.dataTransfer.files.item(0);
    setValue(formVariable, newFile!, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  const loadedLabel =
    fileKind === "excel" ? "Excel carregado." : "PDF carregado.";

  return (
    <div
      className={cn(
        "p-4 bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col items-center w-full transition-all",
        fullHeight && "flex-1 min-h-0",
      )}
    >
      <div className="font-bold text-foreground text-center mb-2 font-redhat text-sm">
        <p>{message}</p>
      </div>

      <div
        ref={contentRef}
        className={cn(
          "w-full flex mt-2.5",
          fullHeight
            ? "flex-1 min-h-0 overflow-y-auto justify-center items-start"
            : "h-auto overflow-hidden justify-center items-start",
        )}
      >
        {previewUrl && !alwaysShowDropZone ? (
          fileKind === "excel" && variableValue instanceof File ? (
            <ExcelFilePreview file={variableValue} handleDelete={deleteFile} />
          ) : (
            <PdfPreview
              url={previewUrl}
              handleDelete={deleteFile}
              width={previewWidth > 0 ? previewWidth : undefined}
            />
          )
        ) : (
          <div
            className={cn(
              "w-full h-40 rounded-lg border-2 border-dashed flex flex-col justify-center items-center select-none transition-all duration-200",
              isDragging
                ? "border-primary bg-primary/10 scale-[1.02]"
                : previewUrl
                  ? "border-primary/50 bg-primary/5"
                  : "border-muted-foreground/30 bg-muted/20 hover:border-primary/50",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDragDrop}
          >
            <div className="flex flex-col items-center gap-2 text-sm">
              {isDragging ? (
                <span className="text-primary font-bold animate-pulse">
                  Solte o arquivo aqui
                </span>
              ) : previewUrl ? (
                <div className="text-muted-foreground text-center px-4">
                  <span className="text-primary font-medium">
                    {loadedLabel}
                  </span>{" "}
                  Arraste ou{" "}
                  <button
                    type="button"
                    className="text-primary font-bold hover:underline underline-offset-4"
                    onClick={selectFiles}
                  >
                    procure
                  </button>{" "}
                  para substituir
                </div>
              ) : (
                <div className="text-muted-foreground text-center px-4">
                  Arraste o arquivo ou{" "}
                  <button
                    type="button"
                    className="text-primary font-bold hover:underline underline-offset-4"
                    onClick={selectFiles}
                  >
                    procure
                  </button>
                </div>
              )}
            </div>

            <input
              {...rest}
              name={formVariable}
              type="file"
              ref={(e) => {
                registerRef(e);
                fileInputRef.current = e;
              }}
              hidden
              accept={accept}
              onChange={handleFileSelect}
            />
          </div>
        )}
      </div>
    </div>
  );
}
