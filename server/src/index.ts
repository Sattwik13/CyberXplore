import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import { scanQueue } from './queue';
import FileMeta from './models/FileMeta';
import './scannerWorker'; // Start the worker

dotenv.config();

const app = express();
app.use(cors());
app.use('/uploads', express.static('uploads'));

// DB connection
mongoose.connect(process.env.MONGO_URI!).then(() => console.log('MongoDB connected'));

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.docx', '.jpg', '.png'];
    const ext = (file.originalname.match(/\.\w+$/) || [''])[0];
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('File type not allowed'));
  }
});

// POST /upload
app.post('/upload', upload.single('file'), async (req, res) => {

  if (!req.file) return res.status(400).send('No file');

  const fileDoc = await FileMeta.create({
    filename: req.file.originalname,
    path: req.file.path,
    status: 'pending',
    uploadedAt: new Date(),
    scannedAt: null,
    result: null,
  });

  await scanQueue.add('scan', { fileId: fileDoc._id, filePath: req.file.path });
  res.json(fileDoc);
});

// GET /files
app.get('/files', async (req, res) => {
  
  const filter: any = {};
  if (req.query.result) filter.result = req.query.result;

  const files = await FileMeta.find().sort({ uploadedAt: -1 });
  res.json(files);
});

// Server port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up on port ${port}`));
