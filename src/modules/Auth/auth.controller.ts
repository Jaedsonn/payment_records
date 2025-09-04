import { AuthService } from "./auth.service";
import { NextFunction, Request, Response } from "express";
import { ErrorEnum } from "@lib/enums";
import { env } from "@shared/env";

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
        const {acess_token, refresh_token, ...user} = await this.authService.login(req.body);

        res.status(200).cookie(
          'acess_token',
          acess_token, {
          sameSite: "strict",
          httpOnly: true,
          maxAge: env.ACCESS_EXPIRE as number,
          secure: true,
        }).cookie('refresh_token', refresh_token, {
          sameSite: 'strict',
          maxAge: env.REFRESH_EXPIRE as number,
          secure: true
        }).json(user)
      } catch (error) {
        return next(ErrorEnum.INVALID_CREDENTIALS)
      }
    }
}
