import { Subject } from "./Subject"

export type SubjectPageResponse = {
  pageItems: number
  totalItems: number
  pages: number
  data: Subject[]
}