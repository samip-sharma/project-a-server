import { z } from "zod";

export const E164PhoneNumberSchema = z.string().regex(/^\+1\d{10}$/);
