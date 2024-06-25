import { sign, verify } from "hono/jwt";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "./env.js";
import { z } from "zod";

const ACCESS_TOKEN_VALIDITY_DURATION_SECONDS = 3 * 60 * 60; // 3 hours
const REFRESH_TOKEN_VALIDITY_DURATION_SECONDS = 10 * 24 * 60 * 60; // 10 days

const AccessTokenPayloadSchema = z.object({ userId: z.string().uuid() });
type AccessTokenPayload = z.infer<typeof AccessTokenPayloadSchema>;

export function createAccessToken(userId: string): Promise<string> {
	return sign({ userId, iat: Date.now(), exp: ACCESS_TOKEN_VALIDITY_DURATION_SECONDS }, ACCESS_TOKEN_SECRET);
}

export function createRefreshToken(): Promise<string> {
	return sign({ iat: Date.now(), exp: REFRESH_TOKEN_VALIDITY_DURATION_SECONDS }, REFRESH_TOKEN_SECRET);
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload> {
	const payload = await verify(token, ACCESS_TOKEN_SECRET);

	return AccessTokenPayloadSchema.parse(payload);
}

export async function verifyRefreshToken(token: string): Promise<void> {
	await verify(token, REFRESH_TOKEN_SECRET);
}
