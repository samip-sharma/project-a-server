import type { PgColumnBuilderBase } from "drizzle-orm/pg-core";
import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

function table<ColumnsMap extends Record<string, PgColumnBuilderBase>>(name: string, columns: ColumnsMap) {
	return pgTable(name, {
		id: uuid("id").primaryKey().defaultRandom(),
		...columns,
	});
}

function timestampedTable<ColumnsMap extends Record<string, PgColumnBuilderBase>>(name: string, columns: ColumnsMap) {
	return table(name, {
		...columns,
		createdAt: timestamp("created_at").notNull().defaultNow(),
	});
}

export const users = timestampedTable("users", {
	phoneNumber: varchar("phone_number", { length: 15 }).notNull(),
});

export const oneTimePasswords = timestampedTable("one_time_passwords", {
	phoneNumber: varchar("phone_number", { length: 15 }).notNull(),
	value: varchar("value", { length: 6 }).notNull(),
	usedAt: timestamp("used_at"),
});
