import { Request, Response, NextFunction } from "express";
import { ErrorEnum } from "@lib/enums";
import { BankService } from "./bank.service";

export class BankController{
    constructor(
        private bankService: BankService
    ){}

    public getBankInfoById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const bankId = req.params.id;
            if(!bankId) throw new Error(ErrorEnum.UNAUTHORIZED.message);

            const bankInfo = await this.bankService.getBankDetailsById(bankId);
            res.status(200).json({ bankInfo });
        } catch (error) {
            next(error);
        }
    }

    public getBankInfoByName = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.body;

            if(!body.name) throw new Error(ErrorEnum.BAD_REQUEST.message);

            const bankInfo = await this.bankService.getBankDetailsByName(body.name);
            res.status(200).json({ bankInfo });
        } catch (error) {
            next(error);
        }
    }
}