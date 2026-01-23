import { Router } from "express";
import { TransactionFactory } from "./transaction.factory";
import { validateToken } from "@middlewares/jwt";
import { bodyParser } from "@middlewares/bodyparser";
import { CreateTransactionSchema, UpdateTransactionSchema } from "@lib/schema";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const TransactionRouter = Router();
export const transactionRegistry = new OpenAPIRegistry();

TransactionRouter.post(
  "/create",
  validateToken,
  bodyParser(CreateTransactionSchema),
  TransactionFactory.createController().createTransaction
);

transactionRegistry.registerPath({
  method: 'post',
  path: '/create',
  tags: ['Transaction'],
  summary: 'Create a new transation',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateTransactionSchema,
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Transaction created successfully',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().openapi({example: true}),
            message: z.string().openapi({example: 'Transaction created successfully'}),
            data: CreateTransactionSchema
          })
        }
      }
    }, 
    400: {
      description: 'Bad Request',
      summary: 'Return a validation error if the request body does not conform to the CreateTransactionSchema'
    }
  }
})

TransactionRouter.get(
  "/list",
  validateToken,
  TransactionFactory.createController().listTransactions
);

transactionRegistry.registerPath({
  method: 'get',
  path: '/list',
  tags: ['Transaction'],
  summary: 'List transactions for the authenticated user',
  request: {
    headers: z.object({
      authorization: z.string().openapi({
        description: "Bearer token for authentication",
        example: "Bearer your_jwt_token_here"
      })
    })
  },
  responses: {
    200: {
      description: 'List of transactions',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().openapi({example: true}),
            data: z.array(CreateTransactionSchema.omit({accountId: true}))
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



TransactionRouter.get(
  "/summary",
  validateToken,
  TransactionFactory.createController().getTransactionSummary
);

transactionRegistry.registerPath({
  method: 'get',
  path: '/summary',
  tags: ['Transaction'],
  summary: 'Get transaction summary for the authenticated user',
  request: {
    headers: z.object({
      authorization: z.string().openapi({
        description: "Bearer token for authentication",
        example: "Bearer your_jwt_token_here"
      })
    }),
    query: z.object({
      accountId: z.string().optional().openapi({
        description: "Account ID to filter summary",
        example: "acc_12345"
      })
    })
  },
  responses: {
    200: {
      description: 'Transaction summary retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().openapi({example: true}),
            message: z.string().openapi({example: 'Transaction summary retrieved successfully'}),
            data: z.object({ summary: z.any() })
          })
        }
      }
    },
    400: {
      description: 'Bad Request',
      summary: 'Return a validation error if the request parameters are invalid'
    }
  }
});

TransactionRouter.get(
  "/:id",
  validateToken,
  TransactionFactory.createController().getTransactionById
);

transactionRegistry.registerPath({
  method: 'get',
  path: '/{id}',
  tags: ['Transaction'],
  summary: 'Get transaction by ID for the authenticated user',
  request: {
    headers: z.object({
      authorization: z.string().openapi({
        description: "Bearer token for authentication",
        example: "Bearer your_jwt_token_here"
      })
    }),
    params: z.object({
      id: z.string().openapi({
        description: "Transaction ID",
        example: "txn_12345"
      })
    })
  },
  responses: {
    200: {
      description: 'Transaction retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().openapi({example: true}),
            message: z.string().openapi({example: 'Transaction retrieved successfully'}),
            data: z.any()
          })
        }
      }
    },
    404: {
      description: 'Not Found',
      summary: 'Transaction not found'
    }
  }
});

TransactionRouter.put(
  "/:id/update",
  validateToken,
  bodyParser(UpdateTransactionSchema),
  TransactionFactory.createController().updateTransaction
);

transactionRegistry.registerPath({
  method: 'put',
  path: '/{id}/update',
  tags: ['Transaction'],
  summary: 'Update transaction by ID for the authenticated user',
  request: {
    headers: z.object({
      authorization: z.string().openapi({
        description: "Bearer token for authentication",
        example: "Bearer your_jwt_token_here"
      })
    }),
    params: z.object({
      id: z.string().openapi({
        description: "Transaction ID",
        example: "txn_12345"
      })
    }),
    body: {
      content: {
        'application/json': {
          schema: UpdateTransactionSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Transaction updated successfully',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().openapi({example: true}),
            message: z.string().openapi({example: 'Transaction updated successfully'}),
            data: z.any()
          })
        }
      }
    },
    404: {
      description: 'Not Found',
      summary: 'Transaction not found'
    }
  }
});

TransactionRouter.delete(
  "/:id",
  validateToken,
  TransactionFactory.createController().deleteTransaction
);

transactionRegistry.registerPath({
  method: 'delete',
  path: '/{id}',
  tags: ['Transaction'],
  summary: 'Delete transaction by ID for the authenticated user',
  request: {
    headers: z.object({
      authorization: z.string().openapi({
        description: "Bearer token for authentication",
        example: "Bearer your_jwt_token_here"
      })
    }),
    params: z.object({
      id: z.string().openapi({
        description: "Transaction ID",
        example: "txn_12345"
      })
    })
  },
  responses: {
    200: {
      description: 'Transaction deleted successfully',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().openapi({example: true}),
            message: z.string().openapi({example: 'Transaction deleted successfully'})
          })
        }
      }
    },
    404: {
      description: 'Not Found',
      summary: 'Transaction not found'
    }
  }
});
