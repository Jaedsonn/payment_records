import {createClient} from 'redis'
import { env } from '@shared/env'

export const redisClient = createClient({
    url: env.REDIS_URL
})