import { Alternative } from "./Alternative"

export type AdaptedQuestion =  {
  id: string
  title: string
  level:  "Fácil" | "Médio" | "Difícil"
  images: string[]
  alternatives: Alternative[]
}