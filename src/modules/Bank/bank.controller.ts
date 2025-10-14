import { Request, Response, NextFunction } from "express";
import { ErrorEnum } from "@lib/enums";
import { BankService } from "./bank.service";
import type { DefaultMessage } from "@lib/types";

export class BankController {
  constructor(private bankService: BankService) {}

  public getBankInfoById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const bankId = req.params.id;

      const bankInfo = await this.bankService.getBankDetailsById(bankId);

      if (!bankInfo) {
        throw new Error(ErrorEnum.NOT_FOUND.message);
      }

      const response: DefaultMessage = {
        success: true,
        message: "Bank retrieved successfully",
        data: { bank: bankInfo },
      };

      res.status(200).json(response);
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
      const name = req.query.name as string;

      if (!name) {
        throw new Error(ErrorEnum.BAD_REQUEST.message);
      }

      const bankInfo = await this.bankService.getBankDetailsByName(name);

      if (!bankInfo) {
        throw new Error(ErrorEnum.NOT_FOUND.message);
      }

      const response: DefaultMessage = {
        success: true,
        message: "Bank retrieved successfully",
        data: { bank: bankInfo },
      };

      res.status(200).json(response);
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
      const { name, code } = req.body;

      const bank = await this.bankService.registerBank({ name, code });

      const response: DefaultMessage = {
        success: true,
        message: "Bank registered successfully",
        data: { bank },
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getAllBanks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const banks = await this.bankService.getAllBanks();

      const response: DefaultMessage = {
        success: true,
        message: "Banks retrieved successfully",
        data: { banks },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public updateBank = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const bankId = req.params.id;
      const updateData = req.body;

      const bank = await this.bankService.updateBankDetails(bankId, updateData);

      const response: DefaultMessage = {
        success: true,
        message: "Bank updated successfully",
        data: { bank },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public deleteBank = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const bankId = req.params.id;

      const result = await this.bankService.removeBank(bankId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
