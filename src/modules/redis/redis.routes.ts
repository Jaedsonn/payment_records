import { Router } from "express";
import { RedisFactory } from "./redis.factory";
import { Request, Response } from "express";
import { validateToken } from "@middlewares/jwt";
import { Role as RoleEnum } from "@lib/enums";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

export const redisRouter = Router();
export const redisRegistry = new OpenAPIRegistry();

// Here i don't want to expose the store method
// The store is a internal method that should be used by other services, not by external clients

redisRouter.get("/", validateToken, async (req: Request, res: Response) => {
    const role = req.data?.role;
    if(role !== RoleEnum.ADMIN) return res.status(403).json({message: "Forbidden - Admins only"});

   const data = await RedisFactory.createController().getAll();
   return res.status(200).json({data});
})
redisRegistry.registerPath({
    method: "get",
    path: "/redis",
    summary: "Get all Redis keys and values",
    tags: ["Redis"],
    responses: {
        200: {
            description: "Successful response with all Redis keys and values",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties:{
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties:{
                                        key: {type: "string"},
                                        value: {type: "string"}
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
})

redisRouter.get("/:key", validateToken, async (req: Request, res: Response) => {
    const {key} = req.params;
    const role = req.data?.role;
    if(role !== RoleEnum.ADMIN) return res.status(403).json({message: "Forbidden - Admins only"});

    const data = await RedisFactory.createController().get(key);
    if(!data) return res.status(404).json({message: "Key not found"});
    return res.status(200).json({data});
})
redisRegistry.registerPath({
    method: "get",
    path: "/redis/:key",
    summary: "Get a redis value by key",
    tags: ["Redis"],
    parameters: [
        {
            name: "key",
            in: "path",
            required: true,
            schema: {
                type: "string"
            },
            description: "The key of the redis value to retrieve"
        }
    ],
    responses: {
        200: {
            description: "Successful response with the redis value",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            key: {type: "string"},
                            value: {type: "string"}
                        }
                    }
                }
            }
        }
    }
})