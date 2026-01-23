import z from "zod";
import {
  Account as AccountType,
  TransactionType,
  TransactionCategory,
} from "@lib/enums";

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
extendZodWithOpenApi(z);


export const CreateBankSchema = z.object({
  name: z.string().min(3).max(100).openapi({ description: "The name of the bank", example: "First National Bank" }),
  code: z.string().min(3).max(10).openapi({ description: "The code of the bank", example: "FNB" }),
}).openapi("CreateBankDto");

export const UpdateBankSchema = z.object({
  name: z.string().min(3).max(100).optional().openapi({ description: "The name of the bank", example: "First National Bank" }),
  code: z.string().min(3).max(10).optional().openapi({ description: "The code of the bank", example: "FNB" }),
}).openapi("UpdateBankDto");

export const CreateUserSchema = z.object({
  name: z.string().min(5).max(100).openapi({ description: "The name of the user", example: "John Doe" }),
  age: z.number().min(16).max(150).openapi({ description: "The age of the user", example: 30}),
  email: z.email().openapi({ description: "The email of the user", example: "john.doe@example.com" }),
  password: z.string().min(8).max(100).openapi({ description: "The password of the user", example: "strongPassword123" }),
}).openapi("CreateUserDto");

export const UpdateUserSchema = z.object({
  name: z.string().min(5).max(100).optional().openapi({ description: "The name of the user", example: "John Doe" }),
  age: z.number().min(16).max(150).optional().openapi({ description: "The age of the user", example: 30}),
  email: z.email().optional().openapi({ description: "The email of the user", example: "john.doe@example.com" }),
  password: z.string().min(8).max(100).optional().openapi({ description: "The password of the user", example: "strongPassword123" }),
}).openapi("UpdateUserDto");

export const LoginUserSchema = z.object({
  email: z.email().openapi({ description: "The email of the user", example: "john.doe@example.com" }),
  password: z.string().min(8).max(100).openapi({ description: "The password of the user", example: "strongPassword123" }),
}).openapi("LoginUserDto");

export const ForgotPasswordSchema = z.object({
  email: z.email().openapi({ description: "The email of the user", example: "john.doe@example.com" }),
}).openapi("ForgotPasswordDto");

export const ResetPasswordSchema = z.object({
  token: z.string().min(10).openapi({ description: "The reset token", example: "reset_token_12345" }),
  newPassword: z.string().min(8).max(100).openapi({ description: "The new password", example: "newStrongPassword123" }),
}).openapi("ResetPasswordDto");

export const CreateAccountSchema = z.object({
  name: z.string().min(3).max(100).openapi({ description: "The name of the account", example: "Savings Account" }),
  accountNumber: z.string().min(5).max(20).openapi({ description: "The account number", example: "1234567890" }),
  agency: z.string().min(3).max(10).openapi({ description: "The agency of the account", example: "001" }),
  balance: z.number().default(0).optional().openapi({ description: "The balance of the account", example: 1000.00 }),
  isActive: z.boolean().optional().openapi({ description: "The active status of the account", example: true }),
  accountType: z.nativeEnum(AccountType).openapi({ description: "The type of the account", example: AccountType.SAVINGS }),
  bankId: z.string().uuid(),
}).openapi("CreateAccountDto");

export const UpdateAccountSchema = z.object({
  name: z.string().min(3).max(100).optional().openapi({ description: "The name of the account", example: "Savings Account" }),
  accountNumber: z.string().min(5).max(20).optional().openapi({ description: "The account number", example: "1234567890" }),
  agency: z.string().min(3).max(10).optional().openapi({ description: "The agency of the account", example: "001" }),
  balance: z.number().optional().openapi({ description: "The balance of the account", example: 1000.00 }),
  isActive: z.boolean().optional().openapi({ description: "The active status of the account", example: true }),
  accountType: z.nativeEnum(AccountType).optional().openapi({ description: "The type of the account", example: AccountType.SAVINGS }),
}).openapi("UpdateAccountDto");

export const CreateTransactionSchema = z.object({
  accountId: z.string().uuid().openapi({ description: "The ID of the account associated with the transaction", example: "550e8400-e29b-41d4-a716-446655440000" }),
  amount: z.number().positive().openapi({ description: "The amount of the transaction", example: 150.75 }),
  type: z.nativeEnum(TransactionType).openapi({ description: "The type of the transaction", example: TransactionType.PAYMENT }),
  description: z.string().optional().openapi({ description: "A brief description of the transaction", example: "Grocery shopping at SuperMart" }),
  from: z.string().min(1).openapi({ description: "The source of the transaction", example: "Wallet" }),
  to: z.string().min(1).openapi({ description: "The destination of the transaction", example: "SuperMart" }),
  category: z.nativeEnum(TransactionCategory).optional().openapi({ description: "The category of the transaction", example: TransactionCategory.GROCERIES }),
}).openapi("CreateTransactionDto");

export const UpdateTransactionSchema = z.object({
  amount: z.number().positive().optional().openapi({ description: "The amount of the transaction", example: 200.00 }),
  type: z.nativeEnum(TransactionType).optional().openapi({ description: "The type of the transaction", example: TransactionType.PAYMENT }),
  description: z.string().optional().openapi({ description: "A brief description of the transaction", example: "Grocery shopping at SuperMart" }),
  from: z.string().min(1).optional().openapi({ description: "The source of the transaction", example: "Wallet" }),
  to: z.string().min(1).optional().openapi({ description: "The destination of the transaction", example: "SuperMart" }),
  category: z.nativeEnum(TransactionCategory).optional().openapi({ description: "The category of the transaction", example: TransactionCategory.GROCERIES }),
}).openapi("UpdateTransactionDto");
