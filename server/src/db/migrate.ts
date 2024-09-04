import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { appEnv } from '../constants/env.js';

// for migrations
const migrationClient = postgres({
	database: appEnv.DB_NAME,
	host: appEnv.DB_HOST,
	user: appEnv.DB_USER,
	pass: appEnv.DB_PASSWORD,
	ssl: appEnv.DB_SSL,
	max: 1
});
migrate(drizzle(migrationClient), { migrationsFolder: './drizzle' });
