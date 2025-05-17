import { env } from '@/config/env'
import { S3Client } from '@aws-sdk/client-s3'

export const s2 = new S3Client({
	region: 'auto',
	endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: env.CLOUDFLARE_ACESS_KEY_ID,
		secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
	},
})
