import { comparePasswords } from "../../lib/utils";
import bcrypt from "bcryptjs";

test("comparePasswords return true for matching passwords", () => {
    const password = 'mypassword';
    const digest = bcrypt.hashSync(password, 10);

    comparePasswords(password, digest).then((res) => {
        expect(res).toBe(true);
    })

    const wrongPassword = 'wrongpassword';
    comparePasswords(wrongPassword, digest).then((res) => {
        expect(res).toBe(false);
    })
})