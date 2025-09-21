import z from "zod";
import { Request, Response, NextFunction } from "express";
import { ErrorEnum } from "@lib/enums";

export function bodyParser(zodSchema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = zodSchema.parse(req.body);
      req.body = parsedBody;
      next();
    } catch (e) {
      const formatZodError = JSON.parse(e.message);
      return res
        .status(ErrorEnum.MISSING_PROPERTIES.status)
        .json({
          details: formatZodError,
        });
    }
  };
}
