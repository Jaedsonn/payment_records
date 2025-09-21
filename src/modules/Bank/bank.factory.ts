import { BankController } from "./bank.controller";
import { BankService } from "./bank.service";
import { BankRepository } from "./repository/bank.repository";

export class BankFactory{

    static createController(){
        return new BankController(new BankService(new BankRepository))
    }
}