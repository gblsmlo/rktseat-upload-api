import { env } from '@/config/env'
import { userRoute } from '@/routes'
import { fastifyCors } from '@fastify/cors'
import { fastify } from 'fastify'
import {
	hasZodFastifySchemaValidationErrors,
	serializerCompiler,
	validatorCompiler,
} from 'fastify-type-provider-zod'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.register(fastifyCors, {
	origin: '*',
})

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

server.register(userRoute)

server
	.listen({
		host: env.HOST,
		port: env.PORT,
	})
	.then(() => {
		console.log(`🚀 HTTP server running on http://${env.HOST}:${env.PORT}`)
	})
