import { BankService } from '@modules/Bank/bank.service';
import { Bank } from '@modules/Bank/entity/bank.entity';
import { Repository } from 'typeorm';
import { ErrorEnum } from '@lib/enums';
import { TestAppDataSource as dataSource } from './db';

describe('BankService', () => {
    let bankService: BankService;
    let bankRepository: Repository<Bank>;

    beforeAll(async () => {
        await dataSource.initialize();
        bankRepository = dataSource.getRepository(Bank);
        bankService = new BankService(bankRepository);
    });

    afterAll(async () => {
        await dataSource.destroy();
    });

    beforeEach(async () => {
        await dataSource.query(
            ` 
            TRUNCATE TABLE "banks" CASCADE
            `
        )
    });

    describe('getBankDetailsById', () => {
        it('should return bank details when bank exists', async () => {
            const bank = bankRepository.create({
                name: 'Test Bank',
                code: '001',
            });
            const savedBank = await bankRepository.save(bank);

            const result = await bankService.getBankDetailsById(savedBank.id);

            expect(result).toBeDefined();
            expect(result?.id).toBe(savedBank.id);
            expect(result?.name).toBe('Test Bank');
            expect(result?.code).toBe('001');
            expect(result).toHaveProperty('accounts');
        });

        it('should return null when bank does not exist', async () => {
            let mockUuid = '5428d368-ee42-4c86-a390-69623fb67770';
            const result = await bankService.getBankDetailsById(mockUuid);

            expect(result).toBeNull();
        });
    });

    describe('getBankDetailsByName', () => {
        it('should return bank details when bank exists', async () => {
            const bank = bankRepository.create({
                name: 'Test Bank',
                code: '001',
            });
            await bankRepository.save(bank);

            const result = await bankService.getBankDetailsByName('Test Bank');

            expect(result).toBeDefined();
            expect(result?.name).toBe('Test Bank');
            expect(result?.code).toBe('001');
            expect(result).toHaveProperty('accounts');
        });

        it('should return null when bank does not exist', async () => {
            const result = await bankService.getBankDetailsByName('Non-existent Bank');

            expect(result).toBeNull();
        });
    });

    describe('registerBank', () => {
        it('should successfully register a new bank', async () => {
            const bankData = { name: 'New Bank', code: '002' };

            const result = await bankService.registerBank(bankData);

            expect(result).toBeDefined();
            expect(result.id).toBeDefined();
            expect(result.name).toBe('New Bank');
            expect(result.code).toBe('002');

            const savedBank = await bankRepository.findOneBy({ id: result.id });
            expect(savedBank).toBeDefined();
            expect(savedBank?.name).toBe('New Bank');
        });

        it('should throw conflict error when bank name already exists', async () => {
            const existingBank = bankRepository.create({
                name: 'Existing Bank',
                code: '003',
            });
            await bankRepository.save(existingBank);

            const bankData = { name: 'Existing Bank', code: '004' };

            await expect(bankService.registerBank(bankData)).rejects.toThrow(
                ErrorEnum.CONFLICT.message
            );

            const banks = await bankRepository.find();
            expect(banks).toHaveLength(1);
        });

        it('should throw conflict error when bank code already exists', async () => {
            const existingBank = bankRepository.create({
                name: 'Existing Bank',
                code: '001',
            });
            await bankRepository.save(existingBank);

            const bankData = { name: 'New Bank', code: '001' };

            await expect(bankService.registerBank(bankData)).rejects.toThrow(
                ErrorEnum.CONFLICT.message
            );

            const banks = await bankRepository.find();
            expect(banks).toHaveLength(1);
        });
    });

    describe('getAllBanks', () => {
        it('should return all banks sorted by name', async () => {
            const bank1 = bankRepository.create({ name: 'Zebra Bank', code: '001' });
            const bank2 = bankRepository.create({ name: 'Alpha Bank', code: '002' });
            const bank3 = bankRepository.create({ name: 'Beta Bank', code: '003' });

            await bankRepository.save([bank1, bank2, bank3]);

            const result = await bankService.getAllBanks();

            expect(result).toHaveLength(3);
            expect(result[0].name).toBe('Alpha Bank');
            expect(result[1].name).toBe('Beta Bank');
            expect(result[2].name).toBe('Zebra Bank');
        });

        it('should return empty array when no banks exist', async () => {
            const result = await bankService.getAllBanks();

            expect(result).toEqual([]);
        });
    });

    describe('updateBankDetails', () => {
        it('should successfully update bank details', async () => {
            const bank = bankRepository.create({
                name: 'Old Name',
                code: '001',
            });
            const savedBank = await bankRepository.save(bank);

            const updateData = { name: 'New Name' };

            const result = await bankService.updateBankDetails(savedBank.id, updateData);

            expect(result.id).toBe(savedBank.id);
            expect(result.name).toBe('New Name');
            expect(result.code).toBe('001');

            const updatedBank = await bankRepository.findOneBy({ id: savedBank.id });
            expect(updatedBank?.name).toBe('New Name');
        });

        it('should successfully update bank code', async () => {
            const bank = bankRepository.create({
                name: 'Test Bank',
                code: '001',
            });
            const savedBank = await bankRepository.save(bank);

            const updateData = { code: '999' };

            const result = await bankService.updateBankDetails(savedBank.id, updateData);

            expect(result.code).toBe('999');
            expect(result.name).toBe('Test Bank');
        });

        it('should throw not found error when bank does not exist', async () => {
            let mockUuid = '44d86002-2757-4237-9cb9-eca599d7532e'
            await expect(
                bankService.updateBankDetails(mockUuid, { name: 'Test' })
            ).rejects.toThrow(ErrorEnum.NOT_FOUND.message);
        });

        it('should throw conflict error when new name already exists', async () => {
            const bank1 = bankRepository.create({ name: 'Bank One', code: '001' });
            const bank2 = bankRepository.create({ name: 'Bank Two', code: '002' });
            await bankRepository.save([bank1, bank2]);

            await expect(
                bankService.updateBankDetails(bank1.id, { name: 'Bank Two' })
            ).rejects.toThrow(ErrorEnum.CONFLICT.message);
        });

        it('should throw conflict error when new code already exists', async () => {
            const bank1 = bankRepository.create({ name: 'Bank One', code: '001' });
            const bank2 = bankRepository.create({ name: 'Bank Two', code: '002' });
            await bankRepository.save([bank1, bank2]);

            await expect(
                bankService.updateBankDetails(bank1.id, { code: '002' })
            ).rejects.toThrow(ErrorEnum.CONFLICT.message);
        });

        it('should allow updating with same name and code', async () => {
            const bank = bankRepository.create({ name: 'Test Bank', code: '001' });
            const savedBank = await bankRepository.save(bank);

            const result = await bankService.updateBankDetails(savedBank.id, {
                name: 'Test Bank',
                code: '001',
            });

            expect(result.name).toBe('Test Bank');
            expect(result.code).toBe('001');
        });

        it('should update multiple fields at once', async () => {
            const bank = bankRepository.create({ name: 'Old Bank', code: '001' });
            const savedBank = await bankRepository.save(bank);

            const result = await bankService.updateBankDetails(savedBank.id, {
                name: 'New Bank',
                code: '999',
            });

            expect(result.name).toBe('New Bank');
            expect(result.code).toBe('999');
        });
    });

    describe('removeBank', () => {
        it('should successfully remove a bank', async () => {
            const bank = bankRepository.create({ name: 'Test Bank', code: '001' });
            const savedBank = await bankRepository.save(bank);

            const result = await bankService.removeBank(savedBank.id);

            expect(result).toEqual({
                success: true,
                message: 'Bank deleted successfully',
            });

            const deletedBank = await bankRepository.findOneBy({ id: savedBank.id });
            expect(deletedBank).toBeNull();
        });

        it('should throw not found error when bank does not exist', async () => {
            let mockUuid = 'a46400af-3d6e-4003-b7ed-0840eb3c941b'
            await expect(bankService.removeBank(mockUuid)).rejects.toThrow(
                ErrorEnum.NOT_FOUND.message
            );
        });
    });
});