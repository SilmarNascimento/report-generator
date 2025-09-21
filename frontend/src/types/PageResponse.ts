export type PageResponse<Type> = {
  pageItems: number
  totalItems: number
  currentPage: number
  pages: number
  data: Type[]
}