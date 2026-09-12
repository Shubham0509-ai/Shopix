import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

let redisClient = null;

try {
    if (process.env.REDIS_URL) {
        redisClient = new Redis(process.env.REDIS_URL, {
            maxRetriesPerRequest: 1,
            connectTimeout: 5000,
            retryStrategy(times) {
                if (times > 3) return null;
                return Math.min(times * 1000, 3000);
            }
        });

        redisClient.on("connect", () => {
            console.log("Connected to Redis successfully");
        });

        redisClient.on("error", (err) => {
            console.warn("Redis connection notice:", err.message);
        });
    }
} catch (error) {
    console.warn("Failed to initialize Redis client:", error.message);
}

export const redis = redisClient;