import z from "zod";
import { Account as AccountType } from "@lib/enums"        

export const CreateBankSchema = z.object({
    name: z.string().min(5).max(100),
    account: z.string().min(5).max(100)
})

export const UpdateBankSchema = CreateBankSchema.partial();

export const CreateUserSchema = z.object({
    name: z.string().min(5).max(100),
    age: z.number().min(16).max(150),
    email: z.email(),
    password: z.string().min(8).max(100)
})

export const UpdateUserSchema = CreateUserSchema.partial();

export const LoginUserSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(100)
})

export const ForgotPasswordSchema = z.object({
    email: z.email()
})

export const ResetPasswordSchema = z.object({
    token: z.string().min(10),
    newPassword: z.string().min(8).max(100)
})

export const CreateAccountSchema = z.object({
    name: z.string().min(5).max(100),
    balance: z.number().default(0),
    isActive: z.boolean().optional(),
    accountNumber: z.number().min(3),
    accountType: z.enum(AccountType),
})

export const UpdateAccountSchema = CreateAccountSchema.partial();
