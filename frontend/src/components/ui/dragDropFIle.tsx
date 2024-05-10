import { ChangeEvent, DragEvent, useRef, useState } from "react"

type DragDropFileUploaderProps = {
  files: File[]
  setFiles: React.Dispatch<React.SetStateAction<File[]>>
  dependency: boolean
  handleUploadFile: 
}

export function DragDropFIleUploader({ files, setFiles, dependency }: DragDropFileUploaderProps) {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function selectFiles() {
    fileInputRef.current?.click();
  }

  function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    const filesSelected = event.target.files;
    if (!filesSelected || filesSelected?.length === 0) return;
    
    const newFiles: File[] = Array.from(filesSelected);
    setFiles(prev => [...prev, ...newFiles]);
  }

  function deleteImage(index: number) {
    setFiles(prev => prev.filter((_, indexArray) => indexArray !== index));
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

    const newFiles: File[] = Array.from(filesDropped);
    setFiles(prev => [...prev, ...newFiles]);
  }

  function handleUploadFile() {
    console.log("files: ", files);
  }

  return (
    <div className="p-2.5 shadow-[0_0_5px_rgb(255,223,223)] border rounded overflow-hidden flex flex-col justify-between items-center">
      <div className="font-bold text-zinc-200">
        <p>Upload Image</p>
      </div>
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
          name="file"
          type="file"
          className="file"
          multiple
          ref={fileInputRef}
          hidden
          onChange={handleFileSelect}
        />
      </div>
      <div
        className="w-full h-auto flex justify-start items-start flex-wrap max-h-52 overflow-y-auto mt-2.5"
      >
        {files.map((image, index) => (
          <div
            key={index}
            className="w-20 mr-1 h-20 relative mb-2"
          >
            <span
              className="absolute -top-1 right-2 text-xl cursor-pointer"
              onClick={() => deleteImage(index)}
            >
              &times;
            </span>
            <img
              className="w-full h-full rounded"
              src={URL.createObjectURL(image)}
              alt={image.name}
            />
          </div>
        ))}
      </div>
        <button
          className="bg-violet-600 w-full px-2 py-3 font-normal cursor-pointer rounded text-zinc-200 outline-none"
          type="button"
          disabled={!files.length && !dependency}
          onClick={handleUploadFile}
        >
          Upload
        </button>
    </div>
  )
}
