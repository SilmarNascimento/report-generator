import { Alternative } from "./Alternative"

export type AdaptedQuestion =  {
  id: string
  title: string
  level: string
  images: string[]
  alternatives: Alternative[]
}