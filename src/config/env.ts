import { z } from 'zod'

const evnSchema = z.object({
	DATABASE_URL: z.string().url().startsWith('postgresql://'),
	NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
	HOST: z.string().default('0.0.0.0'),
	PORT: z.coerce.number().default(3333),
})

const _env = evnSchema.safeParse(process.env)

if (_env.success === false) {
	console.error('❌ Invalid environment variables', _env.error.format())

	throw new Error('Invalid environment variables.')
}

export const env = _env.data
