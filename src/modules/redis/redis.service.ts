import { redisClient } from "./redis.config";
import { Logger } from "@core/interfaces/logger";

export class RedisService implements Logger{
    private client = redisClient

    store(key: string, value: object){
        this.client.set(key, JSON.stringify(value))
    }

    async get(key: string){
        const data = await this.client.get(key);

        if(!data) return null;

        return JSON.parse(data);
    }

    async getAll(){
        const keys = await this.client.keys("*");
        const allData = {};

        for(const key of keys){
            const data = await this.client.get(key);
            if(!data) continue;
            allData[key] = JSON.parse(data);
        }

        return allData
    }
}