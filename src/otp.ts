import { z } from "zod";
import { randomInt } from "./utils.js";

export const OTP_VALIDITY_DURATION_SECONDS = 5 * 60; // 5 minutes

export const OtpValueSchema = z.string().regex(/^\d{6}$/);

export function generateOTP(): string {
	const otpInt = randomInt(1, 9999);

	return otpInt.toString().padStart(6, "0");
}
