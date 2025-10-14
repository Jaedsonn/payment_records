import z from "zod";
import {
  Account as AccountType,
  TransactionType,
  TransactionCategory,
} from "@lib/enums";

export const CreateBankSchema = z.object({
  name: z.string().min(3).max(100),
  code: z.string().min(3).max(10),
});

export const UpdateBankSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  code: z.string().min(3).max(10).optional(),
});

export const CreateUserSchema = z.object({
  name: z.string().min(5).max(100),
  age: z.number().min(16).max(150),
  email: z.email(),
  password: z.string().min(8).max(100),
});

export const UpdateUserSchema = CreateUserSchema.partial();

export const LoginUserSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(100),
});

export const ForgotPasswordSchema = z.object({
  email: z.email(),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(10),
  newPassword: z.string().min(8).max(100),
});

export const CreateAccountSchema = z.object({
  name: z.string().min(3).max(100),
  accountNumber: z.string().min(5).max(20),
  agency: z.string().min(3).max(10),
  balance: z.number().default(0).optional(),
  isActive: z.boolean().optional(),
  accountType: z.nativeEnum(AccountType),
  bankId: z.string().uuid(),
});

export const UpdateAccountSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  accountNumber: z.string().min(5).max(20).optional(),
  agency: z.string().min(3).max(10).optional(),
  balance: z.number().optional(),
  isActive: z.boolean().optional(),
  accountType: z.nativeEnum(AccountType).optional(),
});

export const CreateTransactionSchema = z.object({
  accountId: z.string().uuid(),
  amount: z.number().positive(),
  type: z.nativeEnum(TransactionType),
  description: z.string().optional(),
  from: z.string().min(1),
  to: z.string().min(1),
  category: z.nativeEnum(TransactionCategory).optional(),
});

export const UpdateTransactionSchema = z.object({
  amount: z.number().positive().optional(),
  type: z.nativeEnum(TransactionType).optional(),
  description: z.string().optional(),
  from: z.string().min(1).optional(),
  to: z.string().min(1).optional(),
  category: z.nativeEnum(TransactionCategory).optional(),
});
