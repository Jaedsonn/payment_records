import { TransactionService } from "./transaction.service";
import { Request, Response, NextFunction } from "express";
import { ErrorEnum } from "@lib/enums";

export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  createTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.data?.id;
      const transactionData = req.body;

      if (!userId) {
        return next(ErrorEnum.UNAUTHORIZED);
      }

      const transaction = await this.transactionService.createTransaction(
        userId,
        transactionData
      );
      return res.status(201).json({
        success: true,
        message: "Transaction created successfully",
        data: transaction,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ErrorEnum.NOT_FOUND.message) {
          return next(ErrorEnum.NOT_FOUND);
        }
        if (error.message === ErrorEnum.FORBIDDEN.message) {
          return next(ErrorEnum.FORBIDDEN);
        }
        if (error.message === ErrorEnum.INSUFFICIENT_FUNDS.message) {
          return next(ErrorEnum.INSUFFICIENT_FUNDS);
        }
        if (error.message === ErrorEnum.ACCOUNT_BLOCKED.message) {
          return next(ErrorEnum.ACCOUNT_BLOCKED);
        }
      }
      return next(ErrorEnum.INTERNAL_SERVER_ERROR);
    }
  };

  listTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.data?.id;
      const { accountId, limit, offset } = req.query;

      if (!userId) {
        return next(ErrorEnum.UNAUTHORIZED);
      }

      const transactions = await this.transactionService.listTransactions(
        userId,
        accountId as string | undefined,
        limit ? Number(limit) : 20,
        offset ? Number(offset) : 0
      );

      return res.status(200).json({
        success: true,
        message: "Transactions retrieved successfully",
        data: transactions,
      });
    } catch (_error) {
      return next(ErrorEnum.INTERNAL_SERVER_ERROR);
    }
  };

  getTransactionById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.data?.id;
      const { id } = req.params;

      if (!userId) {
        return next(ErrorEnum.UNAUTHORIZED);
      }

      if (!id) {
        return next(ErrorEnum.BAD_REQUEST);
      }

      const transaction = await this.transactionService.getTransactionById(
        id,
        userId
      );

      if (!transaction) {
        return next(ErrorEnum.NOT_FOUND);
      }

      return res.status(200).json({
        success: true,
        message: "Transaction retrieved successfully",
        data: transaction,
      });
    } catch (_error) {
      return next(ErrorEnum.INTERNAL_SERVER_ERROR);
    }
  };

  updateTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.data?.id;
      const { id } = req.params;
      const updateData = req.body;

      if (!userId) {
        return next(ErrorEnum.UNAUTHORIZED);
      }

      if (!id) {
        return next(ErrorEnum.BAD_REQUEST);
      }

      const transaction = await this.transactionService.updateTransaction(
        id,
        userId,
        updateData
      );

      return res.status(200).json({
        success: true,
        message: "Transaction updated successfully",
        data: transaction,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === ErrorEnum.NOT_FOUND.message
      ) {
        return next(ErrorEnum.NOT_FOUND);
      }
      return next(ErrorEnum.INTERNAL_SERVER_ERROR);
    }
  };

  deleteTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.data?.id;
      const { id } = req.params;

      if (!userId) {
        return next(ErrorEnum.UNAUTHORIZED);
      }

      if (!id) {
        return next(ErrorEnum.BAD_REQUEST);
      }

      const result = await this.transactionService.deleteTransaction(
        id,
        userId
      );

      return res.status(200).json(result);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === ErrorEnum.NOT_FOUND.message
      ) {
        return next(ErrorEnum.NOT_FOUND);
      }
      return next(ErrorEnum.INTERNAL_SERVER_ERROR);
    }
  };

  getTransactionSummary = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.data?.id;
      const { accountId } = req.query;

      if (!userId) {
        return next(ErrorEnum.UNAUTHORIZED);
      }

      const summary = await this.transactionService.getTransactionSummary(
        userId,
        accountId as string | undefined
      );

      return res.status(200).json({
        success: true,
        message: "Transaction summary retrieved successfully",
        data: summary,
      });
    } catch (_error) {
      return next(ErrorEnum.INTERNAL_SERVER_ERROR);
    }
  };
}
