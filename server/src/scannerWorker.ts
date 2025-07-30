import { Worker } from 'bullmq';
import FileMeta from './models/FileMeta';
import { config } from 'dotenv';
config();

const redis = { connection: { url: process.env.REDIS_URL! } };

function simulateMalwareScan(filePath: string): Promise<'clean'|'infected'> {
  // Read file contents, look for dangerous keywords (simulate)
  // For real code, use fs.readFile. Here, just simulate with filename.
  const DANGEROUS_KEYWORDS = ['rm -rf', 'eval', 'bitcoin'];
  return new Promise((resolve) => {
    setTimeout(() => {
      for (let word of DANGEROUS_KEYWORDS) {
        if (filePath.includes(word)) return resolve('infected');
      }
      resolve('clean');
    }, Math.random() * 3000 + 2000); // 2-5 sec
  });
}

export const scanWorker = new Worker('file-scan', async job => {
  const { fileId, filePath } = job.data;
  const result = await simulateMalwareScan(filePath);
  await FileMeta.findByIdAndUpdate(
    fileId,
    {
      status: 'scanned',
      result,
      scannedAt: new Date()
    }
  );
}, redis);
