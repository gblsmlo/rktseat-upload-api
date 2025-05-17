import { randomUUID } from 'node:crypto'
import { basename, extname } from 'node:path'
import { Readable } from 'node:stream'
import { env } from '@/config/env'
import { Upload } from '@aws-sdk/lib-storage'
import { z } from 'zod'
import { s2 } from './client'

const uploadFileToStorageInput = z.object({
	folder: z.enum(['downloads', 'images']),
	fileName: z.string(),
	contentType: z.string(),
	contentStream: z.instanceof(Readable),
})

type UploadFileToStorageInput = z.infer<typeof uploadFileToStorageInput>

export async function uploadFileToStorage(input: UploadFileToStorageInput) {
	const { folder, fileName, contentType, contentStream } =
		uploadFileToStorageInput.parse(input)

	const fileExtension = extname(fileName)
	const fileNameWithoutExtension = basename(fileName, fileExtension)

	const sanitazedFileName = fileNameWithoutExtension.replace(
		/[^a-zA-Z0-9]/g,
		'',
	)

	const sanitizedFileNameWithExtension = sanitazedFileName.concat(fileExtension)

	const uniqueFileName = `${folder}/${randomUUID()}-${sanitizedFileNameWithExtension}`

	const upload = new Upload({
		client: s2,
		params: {
			Key: uniqueFileName,
			Bucket: env.CLOUDFLARE_BUCKET,
			Body: contentStream,
			ContentType: contentType,
		},
	})

	await upload.done()

	return {
		key: uniqueFileName,
		url: new URL(uniqueFileName, env.CLOUDFLARE_URL).toString(),
	}
}
