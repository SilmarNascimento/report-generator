import { CreateAlternative } from "./createAlternative"

export type CreateQuestion = {
  title: string
  level: string
  alternatives: CreateAlternative[]
}
