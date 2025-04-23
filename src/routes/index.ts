import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const userRoute: FastifyPluginAsyncZod = async (server) => {
	server.get('/user', (_, reply) => {
		return reply.status(200).send({
			message: 'user',
		})
	})
}
