import AccountService from '@modules/Account/account.service';
import { Account } from '@modules/Account/entity/account.entity';
import { User } from '@modules/User/entity/user.entity';
import { Bank } from '@modules/Bank/entity/bank.entity';
import { Repository } from 'typeorm';
import { TestAppDataSource as dataSource } from './db';
import { BankService } from '@modules/Bank/bank.service';
import { generateRandomUser, generateRandomBank, generateRandomAccount, getRandomFromArray } from '../../lib/utils';
import { AuthService } from '@modules/Auth/auth.service';
import { MockEmailService } from './auth.service.spec';
import { Email } from '@core/abstractions/email';
import { MailOptions } from '@lib/types';
import { CreateUserDto } from '@modules/Auth/dto/create-user.dto';
import { simpleFaker } from '@faker-js/faker';

describe('Test account serice', () => {
    let accountService: AccountService;
    let bankService: BankService;
    let authService: AuthService;
    let emailService: Email<MailOptions>
    
    let userRepository: Repository<User>;
    let bankRepository: Repository<Bank>;
    let accountRepository: Repository<Account>;
    
    const users: Array<Partial<User>> = [];
    const banks: Array<Bank> = [];
    const accounts: Array<Partial<Account>> = [];
    
    beforeAll(async () => {
        await dataSource.initialize();
        emailService = new MockEmailService();
        
        userRepository = dataSource.getRepository(User);
        bankRepository = dataSource.getRepository(Bank);
        accountRepository = dataSource.getRepository(Account);
        
        authService = new AuthService(
            userRepository,
            emailService
        )
        
        accountService = new AccountService(
            accountRepository,
            userRepository,
            bankRepository
        )
        
        bankService = new BankService(
            bankRepository
        )

        let i = 4;

        while (i--) {
            const user = generateRandomUser();
            users.push(user);

            const bank = generateRandomBank();
            banks.push(bank as Bank);
        }
        const processUsers = users.map(async (user) => await authService.register(user as CreateUserDto))
        users.map(async (_, index) => {
            users[index] = await processUsers[index];
        })
        await Promise.all(processUsers);

        const processBanks = banks.map(async (bank) => await bankService.registerBank(bank));
        banks.map(async (_, index) => {
            banks[index] = await processBanks[index];
        })
        await Promise.all(processBanks);
    })

    afterAll(async () => {
        await dataSource.destroy();
    })

    describe('Create account', () => {
        it('should create an account successfully', async () => {
            const user = users[getRandomFromArray(users.length)];
            const bank = banks[getRandomFromArray(banks.length)];

            const account = generateRandomAccount(bank.id);

            const createdAccount = await accountService.create(user.id!, account);

            expect(createdAccount).toHaveProperty('id');
            expect(createdAccount).toHaveProperty('accountNumber', account.accountNumber)
            expect(createdAccount).toHaveProperty('accountType', account.accountType)
            expect(createdAccount).toHaveProperty('agency', account.agency)
            expect(createdAccount).toHaveProperty('name', account.name)
            expect(createdAccount).toHaveProperty('balance', '0.00')
            expect(createdAccount).toHaveProperty('isActive', true)

        })

        it('If try to create account with existing account number, should throw error', async () => {
            const user = users[getRandomFromArray(users.length)];
            const bank = banks[getRandomFromArray(banks.length)];

            const account = generateRandomAccount(bank.id);

            const createdAccount = await accountService.create(user.id!, account);
            accounts.push(createdAccount);

            await expect(accountService.create(user.id!, account)).rejects.toThrow('Conflict');
        })

        it('If try to create account with non existing bank, should throw error', async () => {
            const user = users[getRandomFromArray(users.length)];

            const account = generateRandomAccount(simpleFaker.string.uuid());

            await expect(accountService.create(user.id!, account)).rejects.toThrow('Not Found');
        })

        it('If try to create account with non existing user, should throw error', async () => {
            const bank = banks[getRandomFromArray(banks.length)];

            const account = generateRandomAccount(bank.id);

            await expect(accountService.create(simpleFaker.string.uuid(), account)).rejects.toThrow('Not Found');
        })
    })

    describe('Update account', () => {

        it('should update an account successfully', async () => {
            const account = accounts[getRandomFromArray(accounts.length)];
            const userId = account.user?.id;

            const newAccountData = generateRandomAccount(account.bank!.id);

            const updatedAccount = await accountService.update(account.id!, userId!, {
                accountNumber: newAccountData.accountNumber,
                agency: newAccountData.agency,
                name: newAccountData.name,
                accountType: newAccountData.accountType
            });

            expect(updatedAccount).toHaveProperty('id', account.id);
            expect(updatedAccount).toHaveProperty('accountNumber', newAccountData.accountNumber)
            expect(updatedAccount).toHaveProperty('accountType', newAccountData.accountType)
            expect(updatedAccount).toHaveProperty('agency', newAccountData.agency)
            expect(updatedAccount).toHaveProperty('name', newAccountData.name)
        })

        it('If try to update non existing account, should throw error', async () => {
            const account = accounts[getRandomFromArray(accounts.length)];
            const userId = account.user?.id;

            const newAccountData = generateRandomAccount(account.bank!.id);

            await expect(accountService.update(simpleFaker.string.uuid(), userId!, {
                accountNumber: newAccountData.accountNumber,
                agency: newAccountData.agency,
                name: newAccountData.name,
                accountType: newAccountData.accountType
            })).rejects.toThrow('Not Found');
        })

        it('If try to update account with existing account number, should throw error', async () => {
            let account1;
            let account2;

            if (accounts.length < 2) {
                const user = users[getRandomFromArray(users.length)];
                const bank = banks[getRandomFromArray(banks.length)];

                const acc1 = generateRandomAccount(bank.id);
                const acc2 = generateRandomAccount(bank.id);

                account1 = await accountService.create(user.id!, acc1);
                account2 = await accountService.create(user.id!, acc2);

                accounts.push(account1, account2);
            } else {
                account1 = accounts[0];
                account2 = accounts[1];
            }

            const userId = account2.user?.id;

            await expect(accountService.update(account2.id!, userId!, {
                accountNumber: account1.accountNumber,
            })).rejects.toThrow('Conflict');
        })
    })

    describe('Retrieve accounts', () => {
        it('should list all accounts from a specific user', async () => {
            const account = accounts[0];
            const userId = account.user?.id;

            const userAccounts = await accountService.listUserAccounts(userId!);

            expect(Array.isArray(userAccounts)).toBe(true);
            expect(userAccounts.length).toBeGreaterThan(0);
            expect(userAccounts[0]).toHaveProperty('bank');
        });

        it('should get an account by ID', async () => {
            const account = accounts[0];
            const userId = account.user?.id;

            const result = await accountService.getAccountById(account.id!, userId!);

            expect(result).not.toBeNull();
            expect(result?.id).toBe(account.id);
            expect(result).toHaveProperty('transactions');
        });

        it('should get an account by account number', async () => {
            
            const user = await authService.register(generateRandomUser() as CreateUserDto);;
            

            const bankData = generateRandomBank();
            const bank = await bankService.registerBank(bankData);

            const accountData = generateRandomAccount(bank.id);
            const account = await accountService.create(user.id!, accountData);
            accounts.push(account);

            const userId = account.user?.id;
            const result = await accountService.getAccountByAccountNumber(account.accountNumber!, userId!);

            expect(result).not.toBeNull();
            
            expect(result?.accountNumber).toBe(account.accountNumber);
        });

        it('should return the correct balance of an account', async () => {
            const account = accounts[0];
            const userId = account.user?.id;

            const response = await accountService.getAccountBalance(account.id!, userId!);

            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('balance', account.balance);
        });

        it('should throw error when getting balance of non-existing account', async () => {
            const userId = users[0].id!;
            await expect(accountService.getAccountBalance(simpleFaker.string.uuid(), userId))
                .rejects.toThrow();
        });
    });

    describe('Account Status (Alive or Dead)', () => {
        it('should toggle account activation status', async () => {
            const account = accounts[0];
            const userId = account.user?.id;
            const initialStatus = account.isActive;

            const response = await accountService.aliveOrDeadAccount(account.id!, userId!);

            expect(response.success).toBe(true);
            
            const updatedAccount = await accountService.getAccountById(account.id!, userId!);
            expect(updatedAccount?.isActive).toBe(!initialStatus);
        });

        it('should throw error when toggling status of non-existing account', async () => {
            const userId = users[0].id!;
            await expect(accountService.aliveOrDeadAccount(simpleFaker.string.uuid(), userId))
                .rejects.toThrow();
        });
    });

    describe('Delete account', () => {
        it('should delete an account successfully', async () => {
            const user = users[0];
            const bank = banks[0];
            const tempAccData = generateRandomAccount(bank.id);
            const tempAccount = await accountService.create(user.id!, tempAccData);

            const response = await accountService.delete(tempAccount.id!, user.id!);

            expect(response.success).toBe(true);
            expect(response.message).toContain('successfully');

            const check = await accountService.getAccountById(tempAccount.id!, user.id!);
            expect(check).toBeNull();
        });

        it('should throw error when trying to delete non-existing account', async () => {
            const userId = users[0].id!;
            await expect(accountService.delete(simpleFaker.string.uuid(), userId))
                .rejects.toThrow();
        });
    });
})