import { Repository } from "typeorm";
import { AppDataSource } from "@shared/data-source";
import { Bank } from "../entity/bank.entity";

interface IBankRepository<T>{
    findById(id: string): Promise<T | null>;
    findByName(name: string): Promise<T | null>;
    createBank(data: Partial<T>): Promise<T>;
    updateBank(id: string, data: Partial<T>): Promise<T>;
    deleteBank(id: string): Promise<void>;
}

export class BankRepository implements IBankRepository<Bank>{
    constructor(
        private readonly bankRepository: Repository<Bank> = AppDataSource.getRepository(Bank)
    ){}

    async findById(id: string): Promise<Bank | null> {
        return this.bankRepository.findOne({ where: { id } });
    }
    async findByName(name: string): Promise<Bank | null> {
        return this.bankRepository.findOne({ where: { name } });
    }
    async createBank(data: Partial<Bank>): Promise<Bank> {
        const bank = this.bankRepository.create(data);
        return this.bankRepository.save(bank);
    }
    async updateBank(id: string, data: Partial<Bank>): Promise<Bank> {
        return this.bankRepository.save({ ...data, id });
    }
    async deleteBank(id: string): Promise<void> {
        return this.bankRepository.delete(id).then(() => {});
    }

}