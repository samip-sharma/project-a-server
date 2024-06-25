import { z } from "zod";

export const OtpValueSchema = z
	.string()
	.length(6)
	.regex(/^[1-9]\d\d\d$/);

export const E164PhoneNumberSchema = z.string().regex(/^\+1\d{10}$/);

// export const OtpCreationParamsSchema = z.object({})
