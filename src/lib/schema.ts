import z from "zod";

export const CreateBankSchema = z.object({
    name: z.string().min(5).max(100),
    account: z.string().min(5).max(100)
})

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