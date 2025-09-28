import { Request, Response, NextFunction } from "express";
import { ErrorEnum } from "@lib/enums";
import { BankService } from "./bank.service";

export class BankController {
  constructor(private bankService: BankService) {}

  public getBankInfoById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const bankId = req.params.id;
      if (!bankId) throw new Error(ErrorEnum.UNAUTHORIZED.message);

      const bankInfo = await this.bankService.getBankDetailsById(bankId);
      res.status(200).json({ bankInfo });
    } catch (error) {
      next(error);
    }
  };

  public getBankInfoByName = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { name } = req.params;

      if (!name) throw new Error(ErrorEnum.BAD_REQUEST.message);

      const bankInfo = await this.bankService.getBankDetailsByName(name);
      res.status(200).json({ bankInfo });
    } catch (error) {
      next(error);
    }
  };

  public registerBank = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const body = req.body;
      if (!body.name) throw new Error(ErrorEnum.BAD_REQUEST.message);
      const bankInfo = await this.bankService.registerBank({...body, user_id: req.data?.id});
      res.status(201).json({ bankInfo });
    } catch (error) {
      next(error);
    }
  };

  public getAllBanks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const banks = await this.bankService.getAllBanks();
      res.status(200).json({ banks });
    } catch (error) {
      next(error);
    }
  };

  public updateBank = async (req: Request, res: Response, next: NextFunction) =>{
    try {
      const body = req.body;
      const id = req.data?.id;

      if(!id) throw new Error(ErrorEnum.BAD_REQUEST.message);

      const updatedBank = await this.bankService.updateBankDetails(id, body);
      res.status(200).json({ updatedBank });
    } catch (error) {
      next(error);
    }
  }

  public deleteBank = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bankId = req.params.id;
      if(!bankId) throw new Error(ErrorEnum.BAD_REQUEST.message);

      await this.bankService.removeBank(bankId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
