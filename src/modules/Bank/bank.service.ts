import { Bank } from "./entity/bank.entity";
import { Repository } from "typeorm";
import { ErrorEnum } from "@lib/enums";
import type { DefaultMessage } from "@lib/types";

export class BankService {
    constructor(
        private readonly bankRepository: Repository<Bank>
    ) {}

    public async getBankDetailsById(id: string): Promise<Bank | null> {
        return await this.bankRepository.findOne({ 
            where: { id },
            relations: ['accounts']
        });
    }

    public async getBankDetailsByName(name: string): Promise<Bank | null> {
        return await this.bankRepository.findOne({ 
            where: { name },
            relations: ['accounts']
        });
    }

    public async registerBank(data: { name: string; code: string }): Promise<Bank> {
        const existingBank = await this.bankRepository.findOneBy({ name: data.name });
        if (existingBank) {
            throw new Error(ErrorEnum.CONFLICT.message);
        }

        const existingCode = await this.bankRepository.findOneBy({ code: data.code });
        if (existingCode) {
            throw new Error(ErrorEnum.CONFLICT.message);
        }

        const bank = this.bankRepository.create(data);
        return await this.bankRepository.save(bank);
    }

    public async getAllBanks(): Promise<Bank[]> {
        return await this.bankRepository.find({
            order: { name: 'ASC' }
        });
    }

    public async updateBankDetails(id: string, data: Partial<Bank>): Promise<Bank> {
        const bank = await this.bankRepository.findOneBy({ id });
        if (!bank) {
            throw new Error(ErrorEnum.NOT_FOUND.message);
        }

        if (data.name && data.name !== bank.name) {
            const existingBank = await this.bankRepository.findOneBy({ name: data.name });
            if (existingBank) {
                throw new Error(ErrorEnum.CONFLICT.message);
            }
        }

        if (data.code && data.code !== bank.code) {
            const existingCode = await this.bankRepository.findOneBy({ code: data.code });
            if (existingCode) {
                throw new Error(ErrorEnum.CONFLICT.message);
            }
        }

        Object.assign(bank, data);
        return await this.bankRepository.save(bank);
    }

    public async removeBank(id: string): Promise<DefaultMessage> {
        const bank = await this.bankRepository.findOneBy({ id });
        if (!bank) {
            throw new Error(ErrorEnum.NOT_FOUND.message);
        }

        await this.bankRepository.remove(bank);
        
        return {
            success: true,
            message: "Bank deleted successfully"
        };
    }
}