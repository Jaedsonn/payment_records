import { bodyParser } from "../../middlewares/bodyparser";
import { Request, Response } from "express";
import { CreateAccountSchema } from "../../lib/schema";
import { Account as accountEnum, ErrorEnum } from "../../lib/enums";
import { randomUUID } from "crypto";
import z from "zod";
import { unknown } from "zod";

describe("test bodyParser middleware", () => {

    type schema = z.infer<typeof CreateAccountSchema>;

    const mockAccount: schema = {
        accountNumber: "1234567890",
        agency: '00001',
        accountType: accountEnum.BUSINESS,
        bankId: randomUUID(),
        name: 'mock account',
        balance: 0
    }

    const mockRequest = {
        body: mockAccount
    }


    test("should call next if body is valid", () => {
        const req = mockRequest as Request;
        const res = {} as Response;

        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue({});

        const next = jest.fn();


        const mid = bodyParser(CreateAccountSchema);
        mid(req, res, next);

        expect(next).toHaveBeenCalled();
    })

    test("should return if send a invalid attribute in body", () => {
        const invalidRequest = {
            body: {
                ...mockAccount,
                bankId: 123
            }
        }

        const req = invalidRequest as Request;
        const res = {} as unknown as Response

        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn();

        const next = jest.fn();

        const mid2 = bodyParser(CreateAccountSchema);
        mid2(req, res, next);

        expect(next).not.toHaveBeenCalled();
    })

    test("should return if is missing an attribute in body", () => {
        const { bankId, ...mockAccountWithoutBankId } = mockAccount;

        const invalidRequest = {
            body: mockAccountWithoutBankId
        }

        const req = invalidRequest as Request;
        const res = {
        } as unknown as Response

        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn();

        const next = jest.fn();

        const mid2 = bodyParser(CreateAccountSchema);
        mid2(req, res, next);

        expect(next).not.toHaveBeenCalled();
    })
})