import bcrypt from "bcryptjs";
import { IncomingHttpHeaders } from "http";
import { faker } from "@faker-js/faker"; // search for an alternative with ESM support
import { CreateUserSchema, CreateAccountSchema, CreateBankSchema } from "./schema";
import { Account as accountEnum } from "./enums";
import z from 'zod';

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

export function generateRandomUser(): z.infer<typeof CreateUserSchema> {
  return {
    name: faker.person.fullName(),
    age: faker.number.int({ min: 18, max: 80 }),
    email: faker.internet.email(),
    password: faker.internet.password()
  };
}

export function generateRandomBank(): z.infer<typeof CreateBankSchema> {
  return {
    name: faker.company.name() + " Bank",
    code: faker.number.int({ min: 1000, max: 9999 }).toString()
  };
}

export function generateRandomAccount(bankId: string): z.infer<typeof CreateAccountSchema> {
  return {
    accountNumber: faker.finance.accountNumber({ length: 10 }),
    agency: faker.number.int({ min: 1000, max: 9999 }).toString(),
    accountType: faker.helpers.arrayElement([accountEnum.CHECKING, accountEnum.SAVINGS]),
    name: faker.finance.accountName(),
    bankId
  };
}

export const getRandomFromArray = (length: number): number => Math.floor(Math.random() * length);
