import { z } from 'zod'

const envSchema = z.object({
  VITE_PORT: z.string(),
})

export const loadEnv = () => {
  const { VITE_PORT } = envSchema.parse(import.meta.env)
  return { VITE_PORT }
}
