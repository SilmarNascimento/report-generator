import { z } from "zod"

export const subjectSchema = z.object({
  id: z.string(),
  name: z.string()
    .min(3, { message: 'Minimum 3 characters.' })
    .transform(name => {
      return name.trim().split(' ').map(word => {
        return word[0].toUpperCase().concat(word.substring(1).toLowerCase())
      }).join(' ')
    }),
});

export const subjectForm = z.object({
  name: z.string()
    .min(3, { message: 'Minimum 3 characters.' })
    .transform(name => {
      return name.trim().split(' ').map(word => {
        return word[0].toUpperCase().concat(word.substring(1).toLowerCase())
      }).join(' ')
    }),
});