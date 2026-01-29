import { Email } from "@core/abstractions/email";
import { AuthService } from "@modules/Auth/auth.service";
import { User } from "@modules/User/entity/user.entity";
import { TestAppDataSource as dataSource } from "./db";
import { MailOptions } from "@lib/types";
import { CreateUserDto } from "@modules/Auth/dto/create-user.dto";


export class MockEmailService extends Email<MailOptions> {
    constructor() {
        super({ sendEmail: async () => true });
    }

    send = jest.fn().mockResolvedValue(true);
}

let authService: AuthService;
let emailService: Email<MailOptions>;
let validUser;

describe("Auth Service Integration Tests", () => {
    beforeAll(async () => {
        await dataSource.initialize();

        dataSource.query(
            ` 
            TRUNCATE TABLE "users" CASCADE
            `
        )

        emailService = new MockEmailService()
        authService = new AuthService(dataSource.getRepository(User), emailService);
        validUser = {
            name: 'John Doe',
            age: 30,
            email: `john.doe@example.com`,
            password: 'strongPassword123'
        }
    })

    beforeEach(() => {
        jest.clearAllMocks();
    })

    afterAll(() => {
        dataSource.destroy().then(() => {
            console.log("Data source destroyed after auth service tests");
        })
    })

    test('Register user', async () => {

        const response = await authService.register(validUser);

        expect(response).toHaveProperty('id');
        expect(response).toHaveProperty('name', validUser.name);
        expect(response).toHaveProperty('email', validUser.email);
    })

    test('Register user with existing email should fail', async () => {
        await expect(authService.register(validUser)).rejects.toThrow('User already exists');
    })

    test('Register user with missing attributes should fail', async () => {
        const user = {
            name: 'John Doe',
            age: 30,
            password: 'strongPassword123'
        }

        await expect(authService.register(user as CreateUserDto)).rejects.toThrow();
    })

    test('Valid user login should return tokens and the user info', async () => {
        const response = await authService.login({
            email: validUser.email,
            password: validUser.password
        })

        expect(response).toHaveProperty('access_token');
        expect(response).toHaveProperty('refresh_token');
        expect(response).toHaveProperty('email', validUser.email);
        expect(response).toHaveProperty('password');
    })

    test('Invalid user login should fail', async () => {
        await expect(authService.login({
            email: `john.doe@example.com`,
            password: 'wrongPassword123'
        })).rejects.toThrow('Invalid credentials');
    })

    test('Reset password should send a email for the user with the html template and return a message', async () => {
        // for test all flow first we call the forgotPassword service to generate the token and send the email
        const response = await authService.forgotPassword(validUser.email);
        expect(response).toHaveProperty('message', 'Password reset email sent');
        expect(emailService.send).toHaveBeenCalledTimes(1);
        expect(emailService.send).toHaveBeenCalledWith(
            expect.objectContaining({
                to: validUser.email,
                subject: 'Password Reset',
                html: expect.any(String),
                messageId: expect.any(String),
                from: expect.any(String)
            })
        )

        const emailOptions = (emailService.send as jest.Mock).mock.calls[0][0];
        const resetToken = emailOptions.messageId;
        const html = emailOptions.html;

        
        // now we can test the reset password with the token generated
        const newPassword = 'newStrongPassword123';
        await expect(authService.resetPassword(resetToken, newPassword)).resolves.toEqual({ message: 'Password updated successfully' });
        
        // now we can try to login with the new password
        const loginResponse = await authService.login({
            email: validUser.email,
            password: newPassword
        })
        
        expect(html).toContain(resetToken);
        expect(loginResponse).toHaveProperty('access_token');
        expect(loginResponse).toHaveProperty('refresh_token');
        expect(loginResponse).toHaveProperty('email', validUser.email);
        expect(loginResponse).toHaveProperty('password');
        
    })
})