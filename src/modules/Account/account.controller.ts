import AccountService from "@modules/Account/account.service";
import { Request, Response, NextFunction } from "express";
import { ErrorEnum } from "@lib/enums";
import type { DefaultMessage } from "@lib/types";

export class AccountController {
  constructor(private readonly accountService: AccountService) {}

   createAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.data!.id;
      const accountData = req.body;

      const account = await this.accountService.create(userId, accountData);

      const response: DefaultMessage = {
        success: true,
        message: "Account created successfully",
        data: { account },
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

   updateAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.data!.id;
      const { id } = req.params;
      const accountData = req.body;

      const account = await this.accountService.update(id, userId, accountData);

      const response: DefaultMessage = {
        success: true,
        message: "Account updated successfully",
        data: { account },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

   deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.data!.id;
      const { id } = req.params;

      const result = await this.accountService.delete(id, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

   listAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.data!.id;

      const accounts = await this.accountService.listUserAccounts(userId);

      const response: DefaultMessage = {
        success: true,
        message: "Accounts retrieved successfully",
        data: { accounts },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

   getAccountById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.data!.id;
      const { id } = req.params;

      const account = await this.accountService.getAccountById(id, userId);

      if (!account) {
        throw new Error(ErrorEnum.NOT_FOUND.message);
      }

      const response: DefaultMessage = {
        success: true,
        message: "Account retrieved successfully",
        data: { account },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

   getAccountByAccountNumber  = async(
    req: Request,
    res: Response,
    next: NextFunction
  )  => {
    try {
      const userId = req.data!.id;
      const { accountNumber } = req.params;

      const account = await this.accountService.getAccountByAccountNumber(
        accountNumber,
        userId
      );

      if (!account) {
        throw new Error(ErrorEnum.NOT_FOUND.message);
      }

      const response: DefaultMessage = {
        success: true,
        message: "Account retrieved successfully",
        data: { account },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

   aliveOrDeadAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.data!.id;
      const { id } = req.params;

      const result = await this.accountService.aliveOrDeadAccount(id, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

   getAccountBalance = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.data!.id;
      const { id } = req.params;

      const result = await this.accountService.getAccountBalance(id, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
