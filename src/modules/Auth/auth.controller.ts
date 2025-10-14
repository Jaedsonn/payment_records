import { AuthService } from "./auth.service";
import { NextFunction, Request, Response } from "express";
import { ErrorEnum } from "@lib/enums";
import { env } from "@shared/env";
import { extractTokenFromHeader } from "@lib/utils";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userPassword = req.body.password;
      const user = await this.authService.register(req.body);
      const { access_token, refresh_token, ...userData } =
        await this.authService.login({
          email: user.email,
          password: userPassword,
        });

      return res.status(200).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: userData,
          tokens: {
            accessToken: access_token,
            refreshToken: refresh_token,
          },
        },
      });
    } catch {
      return next(ErrorEnum.USER_ALREADY_EXISTS);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { access_token, refresh_token, ...user } =
        await this.authService.login(req.body);

      res
        .status(200)
        .cookie("access_token", access_token, {
          sameSite: "strict",
          httpOnly: true,
          maxAge: env.ACCESS_EXPIRE as number,
          secure: true,
        })
        .cookie("refresh_token", refresh_token, {
          sameSite: "strict",
          maxAge: env.REFRESH_EXPIRE as number,
          secure: true,
        })
        .json({
          success: true,
          message: "Login successful",
          data: {
            user,
            tokens: {
              accessToken: access_token,
              refreshToken: refresh_token,
            },
          },
        });
    } catch {
      return next(ErrorEnum.INVALID_CREDENTIALS);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = extractTokenFromHeader(
        req.headers,
        "refresh_token"
      );
      const access_token = await this.authService.refreshToken(refresh_token);
      return res
        .status(200)
        .cookie("access_token", access_token, {
          sameSite: "strict",
          httpOnly: true,
          maxAge: env.ACCESS_EXPIRE as number,
          secure: true,
        })
        .json({ message: "Token refreshed" });
    } catch {
      return next(ErrorEnum.UNAUTHORIZED);
    }
  };

  logout = (req: Request, res: Response, next: NextFunction) => {
    try {
      this.authService.logout();
      return res
        .clearCookie("access_token")
        .clearCookie("refresh_token")
        .status(200)
        .json({ message: "Logged out successfully" });
    } catch {
      return next(ErrorEnum.INTERNAL_SERVER_ERROR);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = await this.authService.forgotPassword(req.body.email);
      return res.status(200).json(message);
    } catch (error) {
      console.log(error);
      if (error.message === ErrorEnum.NOT_FOUND.message) {
        return next(ErrorEnum.NOT_FOUND);
      }
      return next(ErrorEnum.INTERNAL_SERVER_ERROR);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, newPassword } = req.body;
      const message = await this.authService.resetPassword(token, newPassword);
      return res.status(200).json(message);
    } catch (error) {
      if (error.message === ErrorEnum.NOT_FOUND.message) {
        return next(ErrorEnum.NOT_FOUND);
      }

      if (error.message === ErrorEnum.UNAUTHORIZED.message) {
        return next(ErrorEnum.UNAUTHORIZED);
      }
      return next(ErrorEnum.INTERNAL_SERVER_ERROR);
    }
  };
}
