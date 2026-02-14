import { RedisService } from "./redis.service";

export class RedisFactory {
    public static createController(){
        return new RedisService();       
    }
}