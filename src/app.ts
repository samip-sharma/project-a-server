import { Hono } from "hono";
import { db, oneTimePasswords } from "./db/index.js";
import { E164PhoneNumberSchema } from "./schemas.js";
import { generateOTP } from "./otp.js";

const app = new Hono();

// TODO: do not create a new OTP if one already exists for the phone number
app.post("/receive_otp", async (ctx) => {
	const body = await ctx.req.json();
	const phoneNumber = E164PhoneNumberSchema.parse(body.phoneNumber);
	const otp = generateOTP();

	await db.insert(oneTimePasswords).values({ phoneNumber, value: otp });

	// TODO: Text the code to the phone number instead of including it in the body
	return ctx.json({ otp });
});

export default app;
