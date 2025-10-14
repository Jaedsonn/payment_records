import bcrypt from "bcryptjs";
import { IncomingHttpHeaders } from "http";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePasswords = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const extractTokenFromHeader = (
  headers: IncomingHttpHeaders,
  tokenType: "access_token" | "refresh_token"
) => {
  const cookies = headers?.cookie;

  if (!cookies) return "";

  const cookieArray = cookies
    .split(";")
    .filter((cookie: string) => cookie.trim().startsWith(`${tokenType}=`));

  if (cookieArray.length === 0) return "";

  const config = cookieArray[0].split("=")[1];

  if (!config) return "";

  return config;
};
