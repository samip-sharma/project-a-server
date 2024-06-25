import { decode, sign, verify } from "hono/jwt";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "./env.js";
import { z } from "zod";

const ACCESS_TOKEN_VALIDITY_DURATION_SECONDS = 3 * 60 * 60; // 3 hours
const REFRESH_TOKEN_VALIDITY_DURATION_SECONDS = 10 * 24 * 60 * 60; // 10 days
const MINIMUM_SECONDS_UNTIL_REFRESH_TOKEN_EXPIRATION_REQUIRED_FOR_REGENERATION = 2 * 24 * 60; // 2 days

type TokenType = "access" | "refresh";

const tokenProperties: Record<TokenType, { secret: string; validityDurationSeconds: number }> = {
	access: {
		secret: ACCESS_TOKEN_SECRET,
		validityDurationSeconds: ACCESS_TOKEN_VALIDITY_DURATION_SECONDS,
	},
	refresh: {
		secret: REFRESH_TOKEN_SECRET,
		validityDurationSeconds: REFRESH_TOKEN_VALIDITY_DURATION_SECONDS,
	},
};

const TokenPayloadSchema = z.object({ userId: z.string().uuid(), iat: z.number(), exp: z.number() });
type TokenPayload = z.infer<typeof TokenPayloadSchema>;

export function createToken(type: TokenType, userId: string): Promise<string> {
	const { secret, validityDurationSeconds } = tokenProperties[type];
	const iat = Date.now() / 1000;

	return sign({ userId, iat, exp: iat + validityDurationSeconds }, secret);
}

export async function verifyToken(type: TokenType, token: string): Promise<TokenPayload> {
	const { secret } = tokenProperties[type];
	const payload = await verify(token, secret);

	return TokenPayloadSchema.parse(payload);
}

export function shouldCreateNewRefreshToken(token: string): boolean {
	const { payload } = decode(token);

	const { exp } = TokenPayloadSchema.parse(payload);

	const secondsUntilExpiration = exp - Date.now() / 1000;

	return secondsUntilExpiration <= MINIMUM_SECONDS_UNTIL_REFRESH_TOKEN_EXPIRATION_REQUIRED_FOR_REGENERATION;
}
