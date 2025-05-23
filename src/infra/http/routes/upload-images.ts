import { uploadImage } from '@/functions/upload-image'
import { isRight, unwrapEither } from '@/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const uploadImageRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		'/uploads',
		{
			schema: {
				summary: 'Upload an image',
				tags: ['uploads'],
				consumes: ['multipart/form-data'],
				response: {
					200: z.object({
						message: z.string(),
					}),
					400: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const uploadedFile = await request.file({
				limits: {
					fieldSize: 1024 * 1024 * 2, // 2MB
				},
			})

			if (!uploadedFile) {
				return reply.status(400).send({ message: 'File is required.' })
			}

			const result = await uploadImage({
				fileName: uploadedFile.filename,
				contentType: uploadedFile.mimetype,
				contentStream: uploadedFile.file,
			})

			if (uploadedFile.file.truncated) {
				return reply.status(400).send({ message: 'File size limit reached.' })
			}

			if (isRight(result)) {
				console.log(unwrapEither(result))

				return reply.status(201).send()
			}

			const error = unwrapEither(result)

			switch (error.constructor.name) {
				case 'InvalidFileFormat':
					return reply.status(400).send({ message: error.message })
			}
		},
	)
}
