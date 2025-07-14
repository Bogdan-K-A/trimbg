// backend/routes/downloadZip.js
import express from "express";
import path from "path";
import { existsSync } from "fs";

const router = express.Router();
const zipDir = "zips";

// 📥 GET /api/zip/:filename
router.get("/zip/:filename", (req, res) => {
  const filePath = path.join(zipDir, req.params.filename);
  if (existsSync(filePath)) res.download(filePath);
  else res.status(404).send("Архив не найден");
});

export default router;
