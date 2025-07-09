// backend/server.js
import express from "express";
import cors from "cors";
import fs, { mkdirSync } from "fs";
import path from "path";
import multer from "multer";

import { clearOldFiles } from "./utils/clearOldFiles.js";
import processRouter from "./routes/process.js";
import downloadRouter from "./routes/download.js";
import zipRouter from "./routes/zip.js";

const app = express();
const PORT = 4000;

// 📁 Создание директорий, если они не существуют
const uploadDir = "tmp";
const processedDir = "processed";
const zipDir = "zips";

mkdirSync(uploadDir, { recursive: true });
mkdirSync(processedDir, { recursive: true });
mkdirSync(zipDir, { recursive: true });

// 🧩 Глобальные мидлвары
app.use(cors()); // Разрешает кросс-доменные запросы
app.use(express.json()); // Позволяет Express читать JSON-тело

// 🔀 Подключение роутов с префиксом /api
app.use("/api", processRouter); // Обработка изображений
app.use("/api", downloadRouter); // Скачивание изображений и ZIP-архивов
app.use("/api", zipRouter); // Генерация ZIP-файлов

// ▶️ Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);

  // 🔁 Каждые 10 минут очищаем старые файлы
  setInterval(() => {
    clearOldFiles(processedDir, 60); // Удаляет картинки старше 60 мин
    clearOldFiles(zipDir, 60); // Удаляет ZIP-файлы старше 60 мин
  }, 10 * 60 * 1000);
});
