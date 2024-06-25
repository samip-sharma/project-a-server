import { randomInt } from "./utils.js";

export const OTP_VALIDITY_DURATION_SECONDS = 5 * 60;

export function generateOTP(): string {
	const otpInt = randomInt(1000, 9999);

	return otpInt.toString();
}
