import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { ErrorEnum } from "@lib/enums";
import { env } from "@shared/env";
import { extractTokenFromHeader } from "@lib/utils";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response) => {
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
      return res.status(400).json({
        success: false,
        message: ErrorEnum.USER_ALREADY_EXISTS.message,
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { access_token, refresh_token, ...user } =
        await this.authService.login(req.body);

      res
        .status(200)
        .cookie("access_token", access_token, {
          sameSite: "strict",
          httpOnly: true,
          secure: true,
        })
        .cookie("refresh_token", refresh_token, {
          sameSite: "strict",
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
      return res.status(401).json({
        success: false,
        message: ErrorEnum.INVALID_CREDENTIALS.message,
      })
    }
  };

  refreshToken = async (req: Request, res: Response) => {
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
      return res.status(401).json({
        success: false,
        message: ErrorEnum.UNAUTHORIZED.message,
      })
    }
  };

  logout = (req: Request, res: Response) => {
    try {
      this.authService.logout();
      return res
        .clearCookie("access_token")
        .clearCookie("refresh_token")
        .status(200)
        .json({ message: "Logged out successfully" });
    } catch {
      return res.status(500).json({
        success: false,
        message: ErrorEnum.INTERNAL_SERVER_ERROR.message,
      })
    }
  };

  forgotPassword = async (req: Request, res: Response) => {
    try {
      const message = await this.authService.forgotPassword(req.body.email);
      return res.status(200).json(message);
    } catch (error) {
      if (error.message === ErrorEnum.NOT_FOUND.message) {
        return res.status(404).json({
          success: false,
          message: ErrorEnum.NOT_FOUND.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: ErrorEnum.INTERNAL_SERVER_ERROR.message,
      });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;
      const message = await this.authService.resetPassword(token, newPassword);
      return res.status(200).json(message);
    } catch (error) {
      if (error.message === ErrorEnum.NOT_FOUND.message) {
        return res.status(404).json({
          success: false,
          message: ErrorEnum.NOT_FOUND.message,
        });
      }

      if (error.message === ErrorEnum.UNAUTHORIZED.message) {
        return res.status(401).json({
          success: false,
          message: ErrorEnum.UNAUTHORIZED.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: ErrorEnum.INTERNAL_SERVER_ERROR.message,
      });
    }
  };
}
