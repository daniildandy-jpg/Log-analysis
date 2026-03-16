// server.js
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { parseLogLine } from './src/parser.js';
import { createStats, updateStats } from './src/stats.js';

const app = express();
const PORT = 3000;

// разрешаем React фронту обращаться к серверу
app.use(cors());

// multer — храним файл в памяти, не на диске
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // проверяем расширение файла
    const allowed = ['.log', '.txt'];
    const ext = file.originalname.slice(file.originalname.lastIndexOf('.'));

    if (allowed.includes(ext)) {
      cb(null, true); // файл подходит
    } else {
      cb(new Error(`Неверный формат файла. Разрешены: ${allowed.join(', ')}`));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // максимум 10MB
  }
});

// POST /api/analyze — принимаем файл и анализируем
app.post('/api/analyze', upload.single('logfile'), (req, res) => {
  // читаем файл из памяти
  const content = req.file.buffer.toString('utf-8');
  const lines = content.split('\n').filter(line => line.trim() !== '');

  const logs = [];
  const invalidLogs = [];
  const stats = createStats();

  // парсим каждую строку
  lines.forEach(line => {
    const parsed = parseLogLine(line);
    if (parsed) {
      logs.push(parsed);
    } else {
      invalidLogs.push({ raw: line, level: 'UNKNOWN' });
    }
    updateStats(stats, parsed);
  });

  // возвращаем всё фронту
  res.json({
    logs,
    invalidLogs,
    stats,
    meta: {
      filename: req.file.originalname,
      totalLines: lines.length,
    }
  });
});

// обработка ошибок multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Файл слишком большой. Максимум 10MB' });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`✅ Сервер запущен: http://localhost:${PORT}`);
});