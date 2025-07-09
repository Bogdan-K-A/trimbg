// backend/routes/download.js
import express from "express";
import path from "path";
import { existsSync } from "fs";

const router = express.Router();
const processedDir = "processed";
const zipDir = "zips";

// 🖼️ GET /api/download/:filename
// Скачивание одного обработанного изображения
router.get("/download/:filename", (req, res) => {
  const filePath = path.join(processedDir, req.params.filename);
  if (existsSync(filePath)) res.download(filePath);
  else res.status(404).send("Файл не найден");
});

// 📥 GET /api/zip/:filename
// Скачивание ZIP-архива
router.get("/zip/:filename", (req, res) => {
  const filePath = path.join(zipDir, req.params.filename);
  if (existsSync(filePath)) res.download(filePath);
  else res.status(404).send("Архив не найден");
});

export default router;
