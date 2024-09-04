import { z } from 'zod';

import { config } from 'dotenv';
config();

export const appEnv = z
	.object({
		FASTIFY_PORT: z.string(),
		FASTIFY_ADDRESS: z.string().url().or(z.literal('localhost')),
		DB_HOST: z.string(),
		DB_USER: z.string(),
		DB_PASSWORD: z.string(),
		DB_NAME: z.string(),
		DB_SSL: z
			.union([z.boolean(), z.literal('require'), z.literal('allow'), z.literal('prefer'), z.literal('verify-full')])
			.optional()
	})
	.parse(process.env);
