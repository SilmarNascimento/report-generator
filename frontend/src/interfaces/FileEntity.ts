
export type FileEntity = {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  fileEntityBytes: string
}

export type FileHandle = {
  file: File,
  url: string
}