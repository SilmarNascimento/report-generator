export type Alternative = {
  id: string
  description: string
  images: string[]
  questionAnswer: boolean
}

export type CreateAlternative = {
  description: string
  questionAnswer: boolean
}