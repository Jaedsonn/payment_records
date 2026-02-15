import { RedisService } from "@modules/redis/redis.service";
import { Request } from "express";

describe("RedisService Integration Tests", () => {
    let redisService: RedisService;

    beforeAll(async () => {
        redisService = new RedisService();
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