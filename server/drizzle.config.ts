import { defineConfig } from 'drizzle-kit';
import { appEnv } from './src/constants/env';

export default defineConfig({
	schema: './src/db/schema.ts',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		host: appEnv.DB_HOST,
		user: appEnv.DB_USER,
		password: appEnv.DB_PASSWORD,
		database: appEnv.DB_NAME,
		ssl: appEnv.DB_SSL
	}
});
