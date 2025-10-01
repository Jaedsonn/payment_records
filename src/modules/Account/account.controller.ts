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
            const {id} = req.params;
            if(!data || !id) return next(new Error(ErrorEnum.INSUFFICIENT_FUNDS.message));

            const account = await this.accountService.update(id,data);
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

    async listAccounts(req: Request, res: Response, next: NextFunction){
        try {
            const accounts = await this.accountService.listUserAccounts(req.data!.id);
            res.status(200).json({accounts})
        } catch (error) {
            next(error)
        }
    }


    async getAccountById(req: Request, res: Response, next: NextFunction){
        try {
            const { id } = req.params;
            if(!id) throw new Error(ErrorEnum.INSUFFICIENT_FUNDS.message);
            return this.accountService.getAccountById(id); 
        } catch (error) {
            next(error)
        }
    }

    async getAccountByAccountNumber(req: Request, res: Response, next: NextFunction){
        try {
            const {accountNumber} = req.params;
            
            if(!accountNumber) throw new Error(ErrorEnum.INSUFFICIENT_FUNDS.message);

            return this.accountService.getAccountByAccountNumber(Number(accountNumber));
        } catch (error) {
            next(error)
        }
    }

    async desactivateAccount(req: Request, res: Response, next: NextFunction){
        try {
            const { id } = req.params;
            if(!id) throw new Error(ErrorEnum.INSUFFICIENT_FUNDS.message);
            const result = await this.accountService.desactivateAccount(id);
            res.status(200).json(result);
        } catch (error) {
            next(error)
        }
    }
    
}