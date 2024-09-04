import fp from 'fastify-plugin';
import Swagger from '@fastify/swagger';
import SwaggerUI from '@fastify/swagger-ui';
import { appEnv } from '../constants/env.js';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

export default fp(async (fastify) => {
	await fastify.register(Swagger, {
		openapi: {
			openapi: '3.0.0',
			info: {
				title: 'Watch List APIs',
				description: '',
				version: '0.0.1'
			},
			servers: [
				{
					url: `http://${appEnv.FASTIFY_ADDRESS}:${appEnv.FASTIFY_PORT}`,
					description: 'Development server'
				}
			],
			tags: [{ name: 'sample', description: 'This is a sample tag.' }],
			components: {
				securitySchemes: {
					apiKey: {
						type: 'apiKey',
						name: 'apiKey',
						in: 'header'
					}
				}
			},
			externalDocs: {
				url: 'https://swagger.io',
				description: 'Find more info here'
			}
		},
		transform: jsonSchemaTransform
	});

	await fastify.register(SwaggerUI, {
		routePrefix: '/documentation',
		uiConfig: {
			docExpansion: 'full',
			deepLinking: false
		},
		uiHooks: {
			onRequest: function (request, reply, next) {
				next();
			},
			preHandler: function (request, reply, next) {
				next();
			}
		},
		staticCSP: true,
		transformStaticCSP: (header) => header,
		transformSpecification: (swaggerObject, request, reply) => {
			return swaggerObject;
		},
		transformSpecificationClone: true
	});
});
