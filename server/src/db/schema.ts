import { boolean, index, numeric, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { v4 as uuidv4 } from 'uuid';

export const users = pgTable(
	'users',
	{
		id: uuid('id')
			.primaryKey()
			.notNull()
			.$defaultFn(() => uuidv4()),
		username: varchar('username', { length: 16 }).notNull(),
		password: varchar('password', { length: 8 }).notNull(),
		email: varchar('email', { length: 32 })
	},
	(users) => ({
		usernameIdx: index('username_idx').on(users.username)
	})
);

const commons = {
	primaryUuid: {
		id: uuid('id')
			.primaryKey()
			.notNull()
			.$defaultFn(() => uuidv4())
	},
	createdModified: {
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		createdById: uuid('created_by')
			.references(() => users.id)
			.notNull(),
		modifiedAt: timestamp('modified_at', { withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date()),
		modifiedById: uuid('modified_by')
			.references(() => users.id)
			.notNull()
	},
	createdModifiedTime: {
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		modifiedAt: timestamp('modified_at', { withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new Date())
	}
};

export const watchItemType = pgEnum('watch_item_type', ['movie', 'series', 'shorts', 'mini-series']);
export const tagType = pgEnum('tag_type', ['language', 'genre', 'custom', 'info']);

export const tags = pgTable('tags', {
	...commons.primaryUuid,
	...commons.createdModified,

	isDefault: boolean('is_default').notNull().default(false),
	displayName: varchar('display_name', { length: 16 }).notNull(),
	type: tagType('type').notNull()
});

export const watchItems = pgTable('watch_items', {
	...commons.primaryUuid,
	...commons.createdModified,

	watchItemType: watchItemType('watch_time_type').notNull(),
	displayName: varchar('display_name', { length: 16 }).notNull()
});

export const watchItemTagMap = pgTable('watch_item_tag_map', {
	...commons.primaryUuid,
	...commons.createdModified,

	watchItemId: uuid('watch_item')
		.references(() => watchItems.id)
		.notNull(),
	tagId: uuid('tag_id')
		.references(() => tags.id)
		.notNull()
});

export const watchStatus = pgEnum('watch_status', ['to-watch', 'watching', 'rated', 'reviewed']);

export const markings = pgTable('markings', {
	...commons.primaryUuid,
	...commons.createdModifiedTime,

	userId: uuid('user_id')
		.references(() => users.id)
		.notNull(),
	watchItemId: uuid('watch_item')
		.references(() => watchItems.id)
		.notNull(),
	status: watchStatus('status').notNull(),
	rating: numeric('rating', { precision: 2 })
});
