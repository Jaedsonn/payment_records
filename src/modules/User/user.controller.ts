import { ErrorEnum } from "@lib/enums";
import { UserService } from "./user.service";
import { Request, NextFunction, Response } from "express";

export class UserController{
  constructor(
    private readonly userService: UserService
  ){}

  updateUser = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const data = req.body;
        if(!data.id){
          throw new Error(ErrorEnum.NOT_FOUND.message);
        }
        const user = await this.userService.updateUser(data?.id, data);
        return res.status(200).json(user);
    } catch (error) {
        if(error instanceof Error && error.message === ErrorEnum.NOT_FOUND.message){
          return next(ErrorEnum.NOT_FOUND);
        }
        next(ErrorEnum.INTERNAL_SERVER_ERROR);
    }
  }

  getUserInfo  =  async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const user = await this.userService.getUserInfo(req.data!.id);
        if(!user) throw new Error(ErrorEnum.NOT_FOUND.message);
        return res.status(200).json(user);
    } catch (error) {
      next(ErrorEnum.INTERNAL_SERVER_ERROR);
    }
  }

  getMostUsedBanks = async (req: Request, res: Response, next: NextFunction) =>{
    try {
      const banks = await this.userService.getMostUsedBanks(req.data!.id);
      return res.status(200).json(banks);
    } catch (error) {
      next(ErrorEnum.INTERNAL_SERVER_ERROR);
    }
  }
}
