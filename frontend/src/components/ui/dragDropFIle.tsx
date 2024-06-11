import { ChangeEvent, DragEvent, useRef, useState } from "react"
import { useFormContext } from "react-hook-form";
import { PdfPreview } from "./pdfPreview";

type DragDropFileUploaderProps = {
  formVariable: string
  message: string
  url: string
}

export function DragDropFileUploader({ formVariable, message, url }: DragDropFileUploaderProps) {
  const { register, setValue, getValues } = useFormContext();
  const variableValue: File = getValues(formVariable);
  
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function selectFiles() {
    fileInputRef.current?.click();
  }

  function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    const filesSelected = event.target.files;
    if (!filesSelected || filesSelected?.length === 0) return;
    
    const newFile = filesSelected.item(0);
    setValue(formVariable, newFile, { shouldDirty: true});
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
    setValue(formVariable, newFile, { shouldDirty: true});
  }

  return (
    <div className="p-2.5 shadow-[0_0_5px_rgb(255,223,223)] border rounded overflow-hidden flex flex-col justify-between items-center">
      <div className="font-bold text-zinc-200">
        <p>{message}</p>
      </div>

      <div
        className="w-full h-auto flex justify-center items-center flex-wrap max-h-52 overflow-y-auto mt-2.5"
      >
        {variableValue
          ? <PdfPreview url={url} handleDelete={deleteImage}/>
          : (
            <div
              className="h-40 rounded border-dashed border-2 border-violet-600 bg-zinc-800 flex flex-col justify-center items-center select-none mt-2.5"
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
                  Drag and Drop file here or {" "}
                  <span className="text-violet-400 ml-1 cursor-pointer transition ease-in-out delay-150 hover:opacity-60" role="button" onClick={selectFiles}>
                    Browse
                  </span>
                </>
              )}
              <input
                {...register(formVariable)}
                name={formVariable}
                type="file"
                className="file"
                ref={fileInputRef}
                hidden
                accept="image/*,.pdf"
                onChange={handleFileSelect}
              />
            </div>
          )
        }
      </div>
    </div>
  )
}
