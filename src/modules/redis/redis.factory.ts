import { RedisService } from "./redis.service";
import { redisClient } from "./redis.config";

export class RedisFactory {
    public static createController(){
        return new RedisService(redisClient);       
    }
}