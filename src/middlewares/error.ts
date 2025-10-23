import { Request, Response, NextFunction } from "express";
import { ErrorType } from "@lib/types";

interface IErrorHandle{
  handle: (err: ErrorType , req: Request, res: Response, next: NextFunction) => void;
}

class ErrorHandler implements IErrorHandle {
    handle(err: ErrorType, req: Request, res: Response): void {
    const { message, status } = err;
    res.status(status).json({ error: message });
  }
}

export default new ErrorHandler();
