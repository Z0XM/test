import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { appEnv } from '../constants/env.js';
import * as schema from './schema.js';

// for query purposes
const queryClient = postgres({
	database: appEnv.DB_NAME,
	host: appEnv.DB_HOST,
	user: appEnv.DB_USER,
	pass: appEnv.DB_PASSWORD,
	ssl: appEnv.DB_SSL
});
export const db = drizzle(queryClient, { schema });
