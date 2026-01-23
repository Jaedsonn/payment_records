
import { AccountFactory } from "@modules/Account/account.factory";
import { Router } from "express";
import { validateToken } from "@middlewares/jwt";
import { bodyParser } from "@middlewares/bodyparser";
import { CreateAccountSchema, UpdateAccountSchema } from "@lib/schema";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);


export const accountRegistry = new OpenAPIRegistry();
export const AccountRouter = Router();

AccountRouter.post(
  "/create",
  bodyParser(CreateAccountSchema),
  validateToken,
  AccountFactory.createController().createAccount
);
accountRegistry.registerPath({
  method: 'post',
  path: '/create',
  tags: ['Account'],
  summary: 'Create a new account',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateAccountSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Account created successfully',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().openapi({example: true}),
            message: z.string().openapi({example: 'Account created successfully'}),
            data: CreateAccountSchema
          })
        }
      }
    },
    400: {
      description: 'Bad Request',
      summary: 'Validation error or missing fields'
    }
  }
});

AccountRouter.put(
  "/update/:id",
  bodyParser(UpdateAccountSchema),
  validateToken,
  AccountFactory.createController().updateAccount
);
accountRegistry.registerPath({
  method: 'put',
  path: '/update/{id}',
  tags: ['Account'],
  summary: 'Update an account by ID',
  request: {
    params: z.object({
      id: z.string().openapi({ description: 'Account ID', example: 'acc_12345' })
    }),
    body: {
      content: {
        'application/json': {
          schema: UpdateAccountSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Account updated successfully',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().openapi({example: true}),
            message: z.string().openapi({example: 'Account updated successfully'}),
            data: UpdateAccountSchema
          })
        }
      }
    },
    400: {
      description: 'Bad Request',
      summary: 'Validation error or missing fields'
    }
  }
});

AccountRouter.patch(
  "/alive-or-dead/:id",
  validateToken,
  AccountFactory.createController().aliveOrDeadAccount
);
accountRegistry.registerPath({
  method: 'patch',
  path: '/alive-or-dead/{id}',
  tags: ['Account'],
  summary: 'Toggle account active status by ID',
  request: {
    params: z.object({
      id: z.string().openapi({ description: 'Account ID', example: 'acc_12345' })
    })
  },
  responses: {
    200: {
      description: 'Account status toggled',
      content: {
        'application/json': {
          schema: z.any()
        }
      }
    }
  }
});

AccountRouter.delete(
  "/delete/:id",
  validateToken,
  AccountFactory.createController().deleteAccount
);
accountRegistry.registerPath({
  method: 'delete',
  path: '/delete/{id}',
  tags: ['Account'],
  summary: 'Delete an account by ID',
  request: {
    params: z.object({
      id: z.string().openapi({ description: 'Account ID', example: 'acc_12345' })
    })
  },
  responses: {
    200: {
      description: 'Account deleted successfully',
      content: {
        'application/json': {
          schema: z.any()
        }
      }
    }
  }
});

AccountRouter.get(
  "/list",
  validateToken,
  AccountFactory.createController().listAccounts
);
accountRegistry.registerPath({
  method: 'get',
  path: '/list',
  tags: ['Account'],
  summary: 'List all accounts for the authenticated user',
  responses: {
    200: {
      description: 'Accounts retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().openapi({example: true}),
            message: z.string().openapi({example: 'Accounts retrieved successfully'}),
            data: z.object({ accounts: z.array(CreateAccountSchema) })
          })
        }
      }
    }
  }
});

AccountRouter.get(
  "/details/number/:accountNumber",
  validateToken,
  AccountFactory.createController().getAccountByAccountNumber
);
accountRegistry.registerPath({
  method: 'get',
  path: '/details/number/{accountNumber}',
  tags: ['Account'],
  summary: 'Get account by account number',
  request: {
    params: z.object({
      accountNumber: z.string().openapi({ description: 'Account number', example: '1234567890' })
    })
  },
  responses: {
    200: {
      description: 'Account retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().openapi({example: true}),
            message: z.string().openapi({example: 'Account retrieved successfully'}),
            data: z.object({ account: CreateAccountSchema })
          })
        }
      }
    },
    404: {
      description: 'Not Found',
      summary: 'Account not found'
    }
  }
});

AccountRouter.get(
  "/details/:id",
  validateToken,
  AccountFactory.createController().getAccountById
);
accountRegistry.registerPath({
  method: 'get',
  path: '/details/{id}',
  tags: ['Account'],
  summary: 'Get account by ID',
  request: {
    params: z.object({
      id: z.string().openapi({ description: 'Account ID', example: 'acc_12345' })
    })
  },
  responses: {
    200: {
      description: 'Account retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().openapi({example: true}),
            message: z.string().openapi({example: 'Account retrieved successfully'}),
            data: z.object({ account: UpdateAccountSchema })
          })
        }
      }
    },
    404: {
      description: 'Not Found',
      summary: 'Account not found'
    }
  }
});

AccountRouter.get(
  "/balance/:id",
  validateToken,
  AccountFactory.createController().getAccountBalance
);
accountRegistry.registerPath({
  method: 'get',
  path: '/balance/{id}',
  tags: ['Account'],
  summary: 'Get account balance by ID',
  request: {
    params: z.object({
      id: z.string().openapi({ description: 'Account ID', example: 'acc_12345' })
    })
  },
  responses: {
    200: {
      description: 'Account balance retrieved',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().openapi({example: true}),
            message: z.string().openapi({example: 'Account balance retrieved'}),
            data: z.object({ balance: z.number() })
          })
        }
      }
    }
  }
});
