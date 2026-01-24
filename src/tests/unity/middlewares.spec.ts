import { CreateAccountSchema } from "@lib/schema";
import { bodyParser } from "@middlewares/bodyparser";
import { randomUUID } from "crypto";
import { Request, Response } from "express";
import { ErrorEnum } from "@lib/enums";
import { Account as accountEnum } from "@lib/enums";
import z from "zod";


describe("bodyParser Middleware", () => {
    type AccountBody = z.infer<typeof CreateAccountSchema>;

    const mockAccount: AccountBody = {
        accountNumber: "1234567890",
        agency: '00001',
        accountType: accountEnum.BUSINESS,
        bankId: randomUUID(),
        name: 'mock account',
        balance: 0
    };

    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;
    const mid = bodyParser(CreateAccountSchema);

    beforeEach(() => {
        req = { body: { ...mockAccount } };
        
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        next = jest.fn();
    });


    test("should call next if body is valid", () => {
        mid(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    test("should return 400 if an attribute has invalid type", () => {
        req.body.bankId = 123;

        mid(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(ErrorEnum.MISSING_PROPERTIES.status);
    });

    test("should return 400 if a required attribute is missing", () => {
        delete req.body.bankId;

        mid(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(ErrorEnum.MISSING_PROPERTIES.status);
    });
});