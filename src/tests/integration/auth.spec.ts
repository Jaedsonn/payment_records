import { Email } from "@core/abstractions/email";
import { AuthService } from "@modules/Auth/auth.service";
import { User } from "@modules/User/entity/user.entity";
import { TestAppDataSource as dataSource } from "./db";
import { MailOptions } from "@lib/types";
import nodemailer from "nodemailer";
import { CreateUserDto } from "@modules/Auth/dto/create-user.dto";


class MockEmailService extends Email<MailOptions> {
    constructor() {
        super({
            sendEmail: async () => {
                return jest.fn();
            }
        });
    }

    send(mailOptions: nodemailer.SendMailOptions) {
        return this.transporter.sendEmail(mailOptions);
    }
}

describe('Testing auth service and operation: register, login and token refresh', () => {
    let authService: AuthService;
    let emailService: Email<MailOptions>;

    beforeAll(async () => {
        await dataSource.initialize();

        dataSource.query(
            ` 
            TRUNCATE TABLE "users" CASCADE
            `
        )

        emailService = new MockEmailService()
        authService = new AuthService(dataSource.getRepository(User), emailService);
    })

    afterAll(() => {
        dataSource.destroy().then(() => {
            console.log("Data source destroyed after auth service tests");
        })
    })

    test('Register user', async () => {
        const user = {
            name: 'John Doe',
            age: 30,
            email: `john.doe@example.com`,
            password: 'strongPassword123'
        }

        const response = await authService.register(user);

        expect(response).toHaveProperty('id');
        expect(response).toHaveProperty('name', user.name);
        expect(response).toHaveProperty('email', user.email);
    })

    test('Register user with existing email should fail', async () => {
        const user = {
            name: 'John Doe',
            age: 30,
            email: `john.doe@example.com`,
            password: 'strongPassword123'
        }

        await expect(authService.register(user)).rejects.toThrow('User already exists');
    })

    test('Register user with missing attributes should fail', async () => {
        const user = {
            name: 'John Doe',
            age: 30,
            password: 'strongPassword123'
        }

        await expect(authService.register(user as CreateUserDto)).rejects.toThrow();
    })
})