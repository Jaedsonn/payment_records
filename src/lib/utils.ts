import bcrypt from "bcryptjs";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePasswords = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const extractTokenFromHeader = (headers: any) => {
  const cookies = headers?.cookie;

  const config = cookies.split(';').filter((cookie: string) => cookie.trim().startsWith('refresh_token='))[0].split('=')[1];

  if(!config) return '';

  return config;
}
