import { Router } from "express";
import { BankFactory } from "./bank.factory";
import { bodyParser } from "@middlewares/bodyparser";
import { CreateBankSchema, UpdateBankSchema } from "@lib/schema";
import { validateToken } from "@middlewares/jwt";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import z from 'zod';
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

const BankRouter = Router();
export const bankRegister = new OpenAPIRegistry();

BankRouter.get(
  "/info/:id",
  validateToken,
  BankFactory.createController().getBankInfoById
);

bankRegister.registerPath({
  method: 'get',
  path: '/info/{id}',
  tags: ['Bank'],
  summary: 'Get bank information by ID',

  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true
    }
  ],
  responses: {
    200: {
      description: 'Bank information retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z.string().openapi({ example: 'Bank retrieved successfully' }),
            data: CreateBankSchema
          })
        }
      }
    },

    400: {
      description: 'Bad Request',
      summary: 'Return a validation error if the request parameters are invalid'
    }
  }
})

BankRouter.get(
  "/search",
  validateToken,
  BankFactory.createController().getBankInfoByName
);

bankRegister.registerPath({
  method: 'get',
  path: '/search',
  tags: ['Bank'],
  summary: 'Search banks by name',
  request: {
    query: z.object({
      name: z.string().openapi({ description: "The name of the bank to search for", example: "Nubank" }),
    })
  },

  responses: {
    200: {
      description: 'Bank information retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z.string().openapi({ example: 'Bank retrieved successfully' }),
            data: CreateBankSchema
          })
        }
      }
    },

    400: {
      description: 'Bad Request',
      summary: 'Return a validation error if the request parameters are invalid'
    }
  }
})

BankRouter.post(
  "/register",
  validateToken,
  bodyParser(CreateBankSchema),
  BankFactory.createController().registerBank
);

bankRegister.registerPath({
  method: 'post',
  path: '/register',
  tags: ['Bank'],
  summary: 'Register a new bank',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateBankSchema
        }
      }
    }
  },

  responses: {
    201: {
      description: 'Bank registered successfully',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z.string().openapi({ example: 'Bank registered successfully' }),
            data: CreateBankSchema
          })
        }
      }
    },

    400: {
      description: 'Bad Request',
      summary: 'Return a validation error if the request parameters are invalid'
    }

  }
})

BankRouter.get(
  "/all",
  validateToken,
  BankFactory.createController().getAllBanks
);

bankRegister.registerPath({
  method: 'get',
  path: '/all',
  tags: ['Bank'],
  summary: 'Get all user banks ',

  responses: {
    200: {
      description: 'User Banks retrivied successfully',
      content: {
        'application/json': {
          schema: z.object({
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Bank registered successfully' }),
              data: z.array(CreateBankSchema)
            })
          })
        }
      }
    },
    400: {
      description: 'Bad Request',
      summary: 'Return a validation error if the request parameters are invalid'
    }
  }
})

BankRouter.put(
  "/update/:id",
  validateToken,
  bodyParser(UpdateBankSchema),
  BankFactory.createController().updateBank
);

bankRegister.registerPath({
  method: 'put',
  path: '/update/{id}',
  tags: ['Bank'],
  summary: 'Update bank information by ID',

  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true
    }
  ],

  responses: {
    200: {
      description: 'Bank updated successfully',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z.string().openapi({ example: 'Bank updated successfully' }),
            data: UpdateBankSchema
          })
        }
      }
    }
  }
})

BankRouter.delete(
  "/delete/:id",
  validateToken,
  BankFactory.createController().deleteBank
);

bankRegister.registerPath({
  method: 'delete',
  path: '/delete/{id}',
  tags: ['Bank'],
  summary: 'Delete bank by ID',

  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true
    }
  ],

  responses: {
    200: {
      description: 'Bank deleted successfully',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z.string().openapi({ example: 'Bank deleted successfully' })
          })
        }
      }
    }
  }
})

export { BankRouter };
