import { Hono } from "hono";
import { db, oneTimePasswords, eq, and, desc, users } from "./db/index.js";
import { E164PhoneNumberSchema } from "./schemas.js";
import { OTP_VALIDITY_DURATION_SECONDS, generateOTP, OtpValueSchema } from "./otp.js";
import { addSeconds, isPast } from "date-fns";
import { createToken, shouldCreateNewRefreshToken, verifyToken } from "./auth.js";

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

app.post("/login_with_otp", async (ctx) => {
	const body = await ctx.req.json();
	const phoneNumber = E164PhoneNumberSchema.parse(body.phoneNumber);
	const otpValue = OtpValueSchema.parse(body.otp);

	const otps = await db
		.select()
		.from(oneTimePasswords)
		.where(and(eq(oneTimePasswords.phoneNumber, phoneNumber), eq(oneTimePasswords.value, otpValue)))
		.orderBy(desc(oneTimePasswords.createdAt));

	for (const otp of otps) {
		const expiresAt = addSeconds(otp.createdAt, OTP_VALIDITY_DURATION_SECONDS);
		const isExpired = isPast(expiresAt);
		const isUsed = !!otp.usedAt;

		const isValid = !isExpired && !isUsed;

		if (isValid) {
			const user = await db.transaction(async (tx) => {
				await tx.update(oneTimePasswords).set({ usedAt: new Date() }).where(eq(oneTimePasswords.id, otp.id));

				let [user] = await tx.insert(users).values({ phoneNumber }).onConflictDoNothing().returning();

				if (!user) {
					[user] = await tx.select().from(users).where(eq(users.phoneNumber, phoneNumber));
				}

				return user;
			});

			const accessToken = await createToken("access", user.id);
			const refreshToken = await createToken("refresh", user.id);

			return ctx.json({ accessToken, refreshToken });
		}
	}

	ctx.status(422);
	return ctx.json({ error: "Invalid OTP" });
});

app.post("/refresh_token", async (ctx) => {
	let refreshToken = ctx.req.header("Authorization")?.split(" ")[1];
	if (!refreshToken) {
		ctx.status(401);
		return ctx.text("Unauthorized");
	}

	const { userId } = await verifyToken("refresh", refreshToken);

	const accessToken = await createToken("access", userId);

	if (shouldCreateNewRefreshToken(refreshToken)) {
		refreshToken = await createToken("refresh", userId);
	}

	return ctx.json({ accessToken, refreshToken });
});

export default app;
