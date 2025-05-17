import { z } from 'zod'

const evnSchema = z.object({
	DATABASE_URL: z.string().url().startsWith('postgresql://'),
	NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
	HOST: z.string().default('0.0.0.0'),
	PORT: z.coerce.number().default(3333),
	CLOUDFLARE_ACCOUNT_ID: z.string(),
	CLOUDFLARE_ACESS_KEY_ID: z.string(),
	CLOUDFLARE_SECRET_ACCESS_KEY: z.string(),
	CLOUDFLARE_BUCKET: z.string(),
	CLOUDFLARE_URL: z.string().url(),
})

const _env = evnSchema.safeParse(process.env)

if (_env.success === false) {
	console.error('❌ Invalid environment variables', _env.error.format())

	throw new Error('Invalid environment variables.')
}

export const env = _env.data
