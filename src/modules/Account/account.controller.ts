import AccountService  from "@modules/Account/account.service"
import {Request, Response, NextFunction} from "express"
import { ErrorEnum } from "@lib/enums";

export class AccountController{

    constructor(
        private readonly accountService: AccountService
    ){}

    async createAccount(req: Request, res: Response, next: NextFunction){
        try{
            const data = req.body;
            if(!data) return next(new Error(ErrorEnum.INSUFFICIENT_FUNDS.message));
            const account = await this.accountService.create(data);
            res.status(201).json({account} )
        }
        catch(error){
            console.debug(error)
            next()
        }
    }

    async updateAccount(req: Request, res: Response, next: NextFunction){
        try {
            const data = req.body;
            if(!data) return next(new Error(ErrorEnum.INSUFFICIENT_FUNDS.message));
            const account = await this.accountService.update(data);
            res.status(200).json({account} )
        }
        catch(error){
            console.debug(error)
            next()
        }
    }

    async deleteAccount(req: Request, res: Response, next: NextFunction){
        try {
            const { id } = req.params;
            if(!id) return next(new Error(ErrorEnum.INSUFFICIENT_FUNDS.message));
            const result = await this.accountService.delete(id);
            res.status(200).json(result);
        } catch (error) {
            next(error)
        }
    }

    async getAccount(req: Request, res: Response, next: NextFunction){
        try {
            const {accountNumber} = req.params;
            if(!accountNumber) return next(new Error(ErrorEnum.INSUFFICIENT_FUNDS.message));
            const account = await this.accountService.findOne(Number(accountNumber));
            if(!account) return next( new Error(ErrorEnum.NOT_FOUND.message) );
            res.status(200).json({account})
        } catch (error) {
            next(error)
        }
    }

}