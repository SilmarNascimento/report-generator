export type PageResponse<Type> = {
  pageItems: number
  totalItems: number
  pages: number
  data: Type[]
}