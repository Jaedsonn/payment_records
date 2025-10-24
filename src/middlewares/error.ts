import { Request, Response, NextFunction } from "express";
import { ErrorType } from "@lib/types";

class ErrorHandler {
  handle(
    err: ErrorType,
    _req: Request,
    res: Response,
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction
  ): void {
    const { message, status } = err;
    res.status(status).json({ error: message });
  }
}

export default new ErrorHandler();
