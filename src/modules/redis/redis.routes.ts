import { Router } from "express";
import { RedisFactory } from "./redis.factory";
import { Request, Response } from "express";

export const redisRouter = Router();

redisRouter.get("/", async (req: Request, res: Response) => {
   const data = await RedisFactory.createController().getAll();
   return res.json({data});
})

redisRouter.get("/:key", async (req: Request, res: Response) => {
    const {key} = req.params;
    const data = await RedisFactory.createController().get(key);
    if(!data) return res.status(404).json({message: "Key not found"});
    return res.json({data});
})