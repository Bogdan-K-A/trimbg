// backend/routes/zip.js
import express from "express";
import fs, { existsSync, createWriteStream } from "fs";
import path from "path";
import archiver from "archiver";
import { randomUUID } from "crypto";

const router = express.Router();
const zipDir = "zips";
const processedDir = "processed";

// 📦 POST /api/generate-zip
// Создаёт ZIP-файл из переданных имён файлов
router.post("/generate-zip", async (req, res) => {
  const { files } = req.body;

  if (!files?.length)
    return res.status(400).json({ error: "No files provided" });

  const zipFilename = `images-${randomUUID()}.zip`;
  const zipPath = path.join(zipDir, zipFilename);
  const archive = archiver("zip", { zlib: { level: 9 } });
  const output = createWriteStream(zipPath);
  archive.pipe(output); // Связываем архив с потоком записи

  // Добавляем каждый файл в архив
  for (const file of files) {
    const filePath = path.join(processedDir, file);
    if (existsSync(filePath)) archive.file(filePath, { name: file });
  }

  // Финализируем архив
  archive.finalize();

  // Отправляем URL архива
  output.on("close", () => {
    res.json({ zipUrl: `/api/zip/${zipFilename}` });
  });

  // Обработка ошибок
  archive.on("error", (err) => {
    console.error("Archive error:", err);
    if (!res.headersSent) res.status(500).json({ error: err.message });
  });
});

export default router;
