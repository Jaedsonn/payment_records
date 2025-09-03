import { AuthService } from "./auth.service";
import { NextFunction, Request, Response } from "express";
import { ErrorEnum } from "@lib/enums";

export class AuthController{
  constructor(
    private readonly authService: AuthService
  ){
  }

   register = async (req: Request, res: Response, next: NextFunction) =>{
    try {
      const user = await this.authService.register(req.body);
      return res.status(200).json(user);
    } catch (error) {
      return next(ErrorEnum.USER_ALREADY_EXISTS);
    }
  }

      login = async (req: Request, res: Response, next: NextFunction) =>{
      try {
        const user = await this.authService.login(req.body)
      } catch (error) {
        return next(ErrorEnum.INVALID_CREDENTIALS)
      }
    }
}
