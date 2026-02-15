import { RedisService } from "@modules/redis/redis.service";
import { Request } from "express";
import { createClient } from "redis";
import { redisClient as Client } from "@modules/redis/redis.config";

describe("RedisService Integration Tests", () => {
    let redisService: RedisService;
    let client: typeof Client;

    beforeAll(async () => {
        client = createClient({
            url: "redis://localhost:6379"
        });

        client.on("error", (err) => console.error("Redis Client Error", err));

        await client.connect();

        redisService = new RedisService(client);
    })

    afterAll(async () => {
        await client.quit();
    })

    test("Store and Retrieve Data", async () => {
        const timestamp = new Date();

        const mockRequest: Partial<Request> = {
            method: "GET",
            url: "/test",
            params: {},
            query: {},
            host: "localhost",
            hostname: "localhost",
            httpVersion: "1.1",
            ip: "127.0.0.1"
        } 

        
        await redisService.store(timestamp.toISOString(), mockRequest);

        const retrieveData = await redisService.get(timestamp.toISOString());
        
        expect(retrieveData).toEqual(mockRequest);
    })
})