import { AuthService } from "./auth.service";
import { Request, Response } from "express";

export class AuthController{
  constructor(
    private readonly authService: AuthService
  ){
  }

   register = async (req: Request, res: Response) =>{
    try {
      const user = await this.authService.register(req.body);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  }
}
