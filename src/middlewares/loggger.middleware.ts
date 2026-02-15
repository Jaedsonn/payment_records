import { RedisService } from "@modules/redis/redis.service";
import { Request, Response, NextFunction } from "express";

export const redisService = new RedisService();

export function loggerMiddleware(req: Request, res: Response, next: NextFunction){
    const timestamp = new Date().toISOString();
    const {method, url, params, query, host, hostname, httpVersion,ip} = req;
    console.log(`[${timestamp}] ${method} ${url} - ${ip}`);
    redisService.store(timestamp, {
        method,
        url,
        params,
        query,
        host,
        hostname,
        httpVersion,
        ip
    })

    next();
};