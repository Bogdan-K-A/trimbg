// backend/routes/process.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import pLimit from "p-limit";
import { createRequire } from "module";
import { randomUUID } from "crypto";

const require = createRequire(import.meta.url);
const { Rembg } = require("rembg-node");
const rembg = new Rembg();

const router = express.Router();
const uploadDir = "tmp";
const processedDir = "processed";
const limit = pLimit(2); // Ограничение на 2 параллельные задачи
const upload = multer({ dest: uploadDir }); // Хранилище для загружаемых файлов

// 🎯 POST /api/process
// Основной маршрут обработки изображений
router.post("/process", upload.array("files", 5), async (req, res) => {
  const { color = "transparent", mirror, format = "png" } = req.body;
  const files = req.files;

  // Проверка: загружены ли файлы
  if (!files?.length)
    return res.status(400).json({ error: "No files uploaded" });

  // Определяем, использовать ли прозрачность
  const useAlpha = color === "transparent" && format !== "jpg";

  // Подготовка RGB-фона, если не прозрачный
  let bg = null;
  if (!useAlpha) {
    const [r, g, b] = color
      .replace("#", "")
      .match(/.{2}/g)
      .map((h) => parseInt(h, 16));
    bg = { r, g, b };
  }

  const results = [];

  // Параллельная обработка каждого изображения
  await Promise.all(
    files.map((file, idx) =>
      limit(async () => {
        try {
          // Генерация имени файла
          const baseName = path.parse(file.originalname).name; // без расширения
          const filename = `${baseName}.${format}`; // новое расширение
          const outputPath = path.join(processedDir, filename);

          // Чтение файла и получение метаданных
          let sharpInput = sharp(await fs.promises.readFile(file.path));
          const metadata = await sharpInput.metadata();

          // Сжатие, если изображение слишком большое
          if (metadata.size > 5 * 1024 * 1024 || metadata.width > 1000) {
            sharpInput = sharp(
              await sharpInput.resize({ width: 1000 }).toBuffer()
            );
          }

          // Удаление фона с помощью rembg
          let img = await rembg.remove(sharpInput);

          // Зеркалирование, если указано
          if (mirror === "true") img = img.flop();

          // Добавление однотонного фона
          if (!useAlpha) img = img.flatten({ background: bg });

          // Конвертация формата
          switch (format) {
            case "jpg":
              img = img.jpeg({ quality: 90 });
              break;
            case "webp":
              img = img.webp({
                quality: 75,
                alphaQuality: 100,
                lossless: false,
                effort: 4,
              });
              break;
            default:
              img = img.png({ quality: 75 });
          }

          // Сохраняем файл и удаляем оригинал
          await fs.promises.writeFile(outputPath, await img.toBuffer());
          await fs.promises.unlink(file.path);

          // Успешный результат
          results.push({
            originalName: file.originalname,
            processedName: filename,
            downloadUrl: `/api/download/${filename}`,
          });
        } catch (err) {
          // Обработка ошибки
          console.error(`❌ Error: ${file.originalname}`, err);
          results.push({
            originalName: file.originalname,
            error: true,
            message: err.message,
          });

          // Удаляем файл, если остался
          if (fs.existsSync(file.path)) await fs.promises.unlink(file.path);
        }
      })
    )
  );

  // Отправляем клиенту список обработанных файлов
  res.json({ files: results });
});

export default router;
