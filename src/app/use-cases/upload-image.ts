import { Readable } from 'node:stream'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { z } from 'zod'

const upaloadImageInput = z.object({
	fileName: z.string(),
	contentType: z.string(),
	contentStream: z.instanceof(Readable),
})

type UpaloadImageInput = z.input<typeof upaloadImageInput>

const allowMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp']

export async function upaloadImageUseCase(input: UpaloadImageInput) {
	const { fileName, contentType, contentStream } = input

	if (!allowMimeTypes.includes(contentType)) {
		throw new Error('Invalid file format.')
	}

	// TODO: send file to cloudflare
	await db.insert(schema.uploads).values({
		name: fileName,
		remoteKey: fileName,
		remoteUrl: fileName,
	})
}
