import { Router } from "express";
import { RedisFactory } from "./redis.factory";
import { Request, Response } from "express";
import { validateToken } from "@middlewares/jwt";
import { Role as RoleEnum } from "@lib/enums";

export const redisRouter = Router();

// Here i don't want to expose the store method
// The store is a internal method that should be used by other services, not by external clients

redisRouter.get("/", validateToken, async (req: Request, res: Response) => {
    const role = req.data?.role;
    if(role !== RoleEnum.ADMIN) return res.status(403).json({message: "Forbidden - Admins only"});

   const data = await RedisFactory.createController().getAll();
   return res.status(200).json({data});
})

redisRouter.get("/:key", validateToken, async (req: Request, res: Response) => {
    const {key} = req.params;
    const role = req.data?.role;
    if(role !== RoleEnum.ADMIN) return res.status(403).json({message: "Forbidden - Admins only"});

    const data = await RedisFactory.createController().get(key);
    if(!data) return res.status(404).json({message: "Key not found"});
    return res.status(200).json({data});
})