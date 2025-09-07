import bcrypt from "bcryptjs";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePasswords = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const extractTokenFromHeader = (headers: any, tokenType: 'access_token' | 'refresh_token') => {
  const cookies = headers?.cookie;

  const config = cookies.split(';').filter((cookie: string) => cookie.trim().startsWith(`${tokenType}=`))[0].split('=')[1];

  if(!config) return '';

  return config;
}
