import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

type DragDropFileUploaderProps = {
  formVariable: string;
};

export function DragDropFileUploader({
  formVariable,
}: DragDropFileUploaderProps) {
  const { register, setValue } = useFormContext();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function selectFiles() {
    fileInputRef.current?.click();
  }

  function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    const filesSelected = event.target.files;
    if (!filesSelected || filesSelected.length === 0) return;
    const newFile = filesSelected.item(0);
    setValue(formVariable, newFile!, { shouldDirty: true });
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
    <div
      className={`h-40 rounded border-dashed border-2 border-violet-600 flex flex-col justify-center items-center select-none mt-2.5 ${isDragging ? "border-violet-400" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDragDrop}
    >
      {isDragging ? (
        <span className="text-violet-400 ml-1 cursor-pointer transition ease-in-out delay-150 hover:opacity-60">
          Drop files here
        </span>
      ) : (
        <>
          Drag and Drop file here or{" "}
          <span
            className="text-violet-400 ml-1 cursor-pointer transition ease-in-out delay-150 hover:opacity-60"
            role="button"
            onClick={selectFiles}
          >
            Browse
          </span>
        </>
      )}
      <input
        {...register(formVariable)}
        type="file"
        ref={fileInputRef}
        hidden
        accept="image/*,.pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        onChange={handleFileSelect}
      />
    </div>
  );
}
