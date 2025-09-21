import z from "zod";
import { Request, Response, NextFunction } from "express";
import { ErrorEnum } from "@lib/enums";

export function bodyParser(zodSchema: z.ZodTypeAny) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsedBody = zodSchema.parse(req.body);
            req.body = parsedBody;
            next();
        } catch (error) {
            return res.status(400).json({ message: ErrorEnum.BAD_REQUEST.message, error });
        }
    }
}
    