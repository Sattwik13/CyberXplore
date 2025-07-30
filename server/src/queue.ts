import { Queue } from 'bullmq';
import { config } from 'dotenv';
config();
const redis = { connection: { url: process.env.REDIS_URL! } };

export const scanQueue = new Queue('file-scan', redis);
