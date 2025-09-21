import { FileEntity, FileHandle } from "../types/FileEntity";

export function parseFile(imageList: FileEntity[]) {
  const fileHandleList: FileHandle[] = imageList.map((fileData) => {
    const { fileName, fileType, fileEntityBytes } = fileData;
    const fileBlob = dataURLtoBlob(fileEntityBytes, fileType);
    const fileEntity = new File([fileBlob], fileName, { type: fileType });
    const fileHandle: FileHandle = {
      file: fileEntity,
      url: window.URL.createObjectURL(fileEntity),
    };

    return fileHandle;
  });

  return fileHandleList;
}

function dataURLtoBlob(byteArray: string, fileType: string) {
  const byteString = window.atob(byteArray);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const fileUint8Array = new Uint8Array(arrayBuffer);

  for (let index = 0; index < byteString.length; index += 1) {
    fileUint8Array[index] = byteString.charCodeAt(index);
  }

  return new Blob([fileUint8Array], { type: fileType });
}
