// backend/routes/downloadSingle.js
import express from "express";
import path from "path";
import { existsSync } from "fs";

const router = express.Router();
const processedDir = "processed";

// 🖼️ GET /api/download/:filename
router.get("/download/:filename", (req, res) => {
  const filePath = path.join(processedDir, req.params.filename);
  if (existsSync(filePath)) res.download(filePath);
  else res.status(404).send("Файл не найден");
});

export default router;
