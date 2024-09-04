import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { db } from '../../db/index.js';
import { count } from 'drizzle-orm';
import { watchItems } from '../../db/schema.js';

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.get(
		'/',
		{
			schema: {
				description: 'Example route'
			}
		},
		async (request, reply) => {
			return 'this is an example';
		}
	);

	fastify.withTypeProvider<ZodTypeProvider>().get(
		'/type/:sample_p',
		{
			schema: {
				querystring: z.object({ sample_q: z.string().optional() }),
				params: z.object({ sample_p: z.string() }),
				response: {
					200: z.object({
						query: z.object({ sample_q: z.string().optional() }),
						params: z.object({ sample_p: z.string() })
					})
				},
				description: 'Example with type provider. Returns object of params & query'
			}
		},
		async (request, reply) => {
			const { query, params } = request;
			reply.send({ query, params });
		}
	);

	fastify.withTypeProvider<ZodTypeProvider>().get(
		'/db',
		{
			schema: {
				response: {
					200: z.object({
						count: z.number()
					}),
					500: z.any()
				},
				description: 'Example with db integration. Returns sample count query'
			}
		},
		async (request, reply) => {
			const rows = await db.select({ count: count() }).from(watchItems);

			if (!rows.length) {
				reply.internalServerError('count query failed');
			}

			reply.send({ count: rows[0].count });
		}
	);
};

export default example;
