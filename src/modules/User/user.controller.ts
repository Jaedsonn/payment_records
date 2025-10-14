import { ErrorEnum } from "@lib/enums";
import { UserService } from "./user.service";
import { Request, NextFunction, Response } from "express";
import type { DefaultMessage } from "@lib/types";

export class UserController {
  constructor(private readonly userService: UserService) {}

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.data!.id;
      const updateData = req.body;

      const user = await this.userService.updateUser(userId, updateData);

      const response: DefaultMessage = {
        success: true,
        message: "User updated successfully",
        data: { user },
      };

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.data!.id;

      const user = await this.userService.getUserInfo(userId);

      if (!user) {
        throw new Error(ErrorEnum.NOT_FOUND.message);
      }

      const response: DefaultMessage = {
        success: true,
        message: "User retrieved successfully",
        data: { user },
      };

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
