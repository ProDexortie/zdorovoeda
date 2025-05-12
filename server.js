import express from 'express';
import path from 'path';
import cors from 'cors';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// Определения для ES модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Загружаем переменные окружения
config();

// Подключение к MongoDB
import connectDB from './config/db.js';
connectDB();

// Создаем Express приложение
const app = express();

// Базовые middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API маршруты
import authRoutes from './routes/auth.js';
import mealsRoutes from './routes/meals.js';
import ordersRoutes from './routes/orders.js';

app.use('/api/auth', authRoutes);
app.use('/api/meals', mealsRoutes);
app.use('/api/orders', ordersRoutes);

// Проверяем наличие собранных файлов
const distExists = fs.existsSync(path.join(__dirname, 'dist'));

if (distExists) {
  // Если есть собранные файлы, обслуживаем их
  app.use(express.static(path.join(__dirname, 'dist')));
  
  // Все маршруты кроме API отдают index.html из dist
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    }
  });
} else {
  // Если сборки нет - настраиваем для разработки
  app.use(express.static(path.join(__dirname)));
  app.use('/public', express.static(path.join(__dirname, 'public')));
  app.use('/src', express.static(path.join(__dirname, 'src')));
  
  // Все маршруты кроме API отдают index.html из корня проекта
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, 'index.html'));
    }
  });
}

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Ошибка сервера' });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});