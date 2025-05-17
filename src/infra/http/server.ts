import { env } from '@/config/env'
import { fastifyCors } from '@fastify/cors'
import fastifyMultipart from '@fastify/multipart'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
	hasZodFastifySchemaValidationErrors,
	serializerCompiler,
	validatorCompiler,
} from 'fastify-type-provider-zod'
import { uploadImageRoute } from './routes/upload-images'
import { transformSwaggerSchema } from './transform-swagger-schema.ts'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, request, reply) => {
	if (hasZodFastifySchemaValidationErrors(error)) {
		return reply.status(400).send({
			message: 'Validation error',
			issues: error.validation,
		})
	}

	console.error(error)

	return reply.status(500).send({ message: 'Internal server error' })
})

server.register(fastifyCors, {
	origin: '*',
})

server.register(fastifyMultipart)
server.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'Upload Server',
			version: '1.0.0',
		},
	},
	transform: transformSwaggerSchema,
})

server.register(fastifySwaggerUi, {
	routePrefix: 'docs',
})

server.register(uploadImageRoute)

server
	.listen({
		host: env.HOST,
		port: env.PORT,
	})
	.then(() => {
		console.log(`🚀 HTTP server running on http://${env.HOST}:${env.PORT}`)
	})
