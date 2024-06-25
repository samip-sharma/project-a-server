import { Hono } from "hono";
import { db, oneTimePasswords } from "./db/index.js";

const app = new Hono();

app.get("/test", async (ctx) => {
	const passwords = await db.select().from(oneTimePasswords);
	return ctx.json({ passwords });
});

export default app;
