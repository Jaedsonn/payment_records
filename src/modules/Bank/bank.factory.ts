import { BankController } from "./bank.controller";
import { BankService } from "./bank.service";
import {AppDataSource} from "@shared/db/data-source";
import { Bank } from "./entity/bank.entity";

export class BankFactory{

    static createController(){
        return new BankController(new BankService(AppDataSource.getRepository(Bank)))
    }
}