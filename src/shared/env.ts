import z from "zod";
import * as dotenv from "dotenv";

dotenv.config();

const envSchema = z.object(
  {
    DB_PORT: z.string(),
    DB_HOST: z.string(),
    DB_USERNAME: z.string(),
    DB_PASSWORD: z.string(),
    DB_DATABASE: z.string(),
    PORT: z.string().or(z.number()),

    SMTP_HOST: z.string(),
    EMAIL_USER: z.string(),
    EMAIL_PASS: z.string(),

    ACCESS_SECRET: z.string(),
    ACCESS_EXPIRE: z.string().or(z.number()),
    REFRESH_SECRET: z.string(),
    REFRESH_EXPIRE: z.string().or(z.number()),
    RESET_SECRET: z.string(),
    RESET_EXPIRE: z.string().or(z.number()),
    FRONTEND_URL: z.url(),
  },
  { error: "Missing variables in env file" }
);

export const env = z.parse(envSchema, process.env);
