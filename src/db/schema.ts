import type { PgColumnBuilderBase } from "drizzle-orm/pg-core";
import { pgTable as table, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

function timestampedTable<ColumnsMap extends Record<string, PgColumnBuilderBase>>(name: string, columns: ColumnsMap) {
	return table(name, {
		...columns,
		createdAt: timestamp("created_at").notNull(),
	});
}

export const users = timestampedTable("users", {
	id: uuid("id").primaryKey(),
	phoneNumber: varchar("phone_number", { length: 15 }).notNull(),
});

export const oneTimePasswords = timestampedTable("one_time_passwords", {
	phoneNumber: varchar("phone_number", { length: 15 }).notNull(),
	id: uuid("id").primaryKey(),
	value: varchar("value", { length: 6 }).notNull(),
	usedAt: timestamp("used_at"),
});
