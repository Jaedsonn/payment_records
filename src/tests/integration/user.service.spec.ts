import { UserService } from "@modules/User/user.service";
import { AuthService } from "@modules/Auth/auth.service";
import { TestAppDataSource as dataSource} from "./db"
import { User } from "@modules/User/entity/user.entity";
import { MockEmailService } from "./auth.service.spec";

describe("UserService Integration Tests", () => {
    let userService: UserService;
    let emailService: MockEmailService;
    let authService: AuthService;
    let user;

    beforeAll(async () => {
        await dataSource.initialize();
        userService = new UserService(dataSource.getRepository(User));
        emailService = new MockEmailService();
        authService = new AuthService(dataSource.getRepository(User), emailService);

        user = {
            name: 'Jane Doe',
            email: 'janedoe@gmail.com',
            password: "securePassword456",
            age: 28
        }

        const registeredUser = await authService.register(user);
        user.id = registeredUser.id;
    })

    afterAll(() => {
        dataSource.destroy().then(() => {
            console.log("Data source destroyed after user service tests");
        })
    })

    test('Get User Info', async () => {
        const userInfo = await userService.getUserInfo(user.id);

        expect(userInfo).toHaveProperty('id', user.id);
        expect(userInfo).toHaveProperty('name', user.name);
        expect(userInfo).toHaveProperty('email', user.email);
    })

    test('Update User info', async () => {
        const updateData = {
            name: 'Jane Smith',
            age: 29
        };

        const updateUser = await userService.updateUser(user.id, updateData);

        expect(updateUser).toHaveProperty('id', user.id);
        expect(updateUser).toHaveProperty('name', updateData.name);
        expect(updateUser).toHaveProperty('age', updateData.age);
    })
})