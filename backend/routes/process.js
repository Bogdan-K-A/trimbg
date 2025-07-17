import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import pLimit from "p-limit";
import { randomUUID } from "crypto";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

// ✅ Выбор пути к rembg в зависимости от платформы
// const rembgCmd =
//   process.platform === "win32" ? "C:\\Python310\\Scripts\\rembg.exe" : "rembg";
// const rembgCmd =
process.platform === "win32"
  ? "C:\\Python310\\Scripts\\rembg.exe"
  : "/home/magystuser/.local/bin/rembg";
// const rembgCmd = "/home/magystuser/.local/bin/rembg";

const router = express.Router();
const uploadDir = "tmp";
const processedDir = "processed";
const limit = pLimit(2); // Ограничение на 2 параллельные задачи
const upload = multer({ dest: uploadDir }); // Хранилище для загружаемых файлов

router.post("/process", upload.array("files", 5), async (req, res) => {
  const { color = "transparent", mirror, format = "png" } = req.body;
  const files = req.files;

  if (!files?.length)
    return res.status(400).json({ error: "No files uploaded" });

  const useAlpha = color === "transparent" && format !== "jpg";

  let bg = null;
  if (!useAlpha) {
    const [r, g, b] = color
      .replace("#", "")
      .match(/.{2}/g)
      .map((h) => parseInt(h, 16));
    bg = { r, g, b };
  }

  const results = [];

  await Promise.all(
    files.map((file) =>
      limit(async () => {
        const baseName = path.parse(file.originalname).name;
        const filename = `${baseName}.${format}`;
        const outputPath = path.join(processedDir, filename);
        const tempInputPng = `${file.path}.png`;
        const tempOutputPng = `${file.path}-nobg.png`;

        try {
          // Конвертация в PNG для rembg
          let sharpInput = sharp(await fs.promises.readFile(file.path));
          const metadata = await sharpInput.metadata();

          if (metadata.size > 5 * 1024 * 1024 || metadata.width > 1000) {
            sharpInput = sharp(
              await sharpInput.resize({ width: 1000 }).toBuffer()
            );
          }

          await sharpInput.png().toFile(tempInputPng);

          // Удаление фона через rembg CLI
          await execFileAsync(rembgCmd, ["i", tempInputPng, tempOutputPng]);

          // Чтение результата
          let img = sharp(tempOutputPng);

          if (mirror === "true") img = img.flop();

          if (!useAlpha) img = img.flatten({ background: bg });

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

          await fs.promises.writeFile(outputPath, await img.toBuffer());

          // Удаление всех временных файлов
          for (const f of [file.path, tempInputPng, tempOutputPng]) {
            if (fs.existsSync(f)) await fs.promises.unlink(f);
          }

          results.push({
            originalName: file.originalname,
            processedName: filename,
            downloadUrl: `/api/download/${filename}`,
          });
        } catch (err) {
          console.error(`❌ Error: ${file.originalname}`, err);
          res.status(500).json({ error: err.message });
          results.push({
            originalName: file.originalname,
            error: true,
            message: err.message,
          });

          for (const f of [file.path, tempInputPng, tempOutputPng]) {
            if (fs.existsSync(f)) await fs.promises.unlink(f);
          }
        }
      })
    )
  );

  res.json({ files: results });
});

export default router;

// =====================================================================================
// backend / routes / process.js;
// import express from "express";
// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import sharp from "sharp";
// import pLimit from "p-limit";
// import { createRequire } from "module";
// import { randomUUID } from "crypto";

// const require = createRequire(import.meta.url);
// const { Rembg } = require("rembg-node");
// const rembg = new Rembg();

// const router = express.Router();
// const uploadDir = "tmp";
// const processedDir = "processed";
// const limit = pLimit(2); // Ограничение на 2 параллельные задачи
// const upload = multer({ dest: uploadDir }); // Хранилище для загружаемых файлов

// // 🎯 POST /api/process
// // Основной маршрут обработки изображений
// router.post("/process", upload.array("files", 5), async (req, res) => {
//   const { color = "transparent", mirror, format = "png" } = req.body;
//   const files = req.files;

//   // Проверка: загружены ли файлы
//   if (!files?.length)
//     return res.status(400).json({ error: "No files uploaded" });

//   // Определяем, использовать ли прозрачность
//   const useAlpha = color === "transparent" && format !== "jpg";

//   // Подготовка RGB-фона, если не прозрачный
//   let bg = null;
//   if (!useAlpha) {
//     const [r, g, b] = color
//       .replace("#", "")
//       .match(/.{2}/g)
//       .map((h) => parseInt(h, 16));
//     bg = { r, g, b };
//   }

//   const results = [];

//   // Параллельная обработка каждого изображения
//   await Promise.all(
//     files.map((file, idx) =>
//       limit(async () => {
//         try {
//           // Генерация имени файла
//           const baseName = path.parse(file.originalname).name; // без расширения
//           const filename = `${baseName}.${format}`; // новое расширение
//           const outputPath = path.join(processedDir, filename);

//           // Чтение файла и получение метаданных
//           let sharpInput = sharp(await fs.promises.readFile(file.path));
//           const metadata = await sharpInput.metadata();

//           // Сжатие, если изображение слишком большое
//           if (metadata.size > 5 * 1024 * 1024 || metadata.width > 1000) {
//             sharpInput = sharp(
//               await sharpInput.resize({ width: 1000 }).toBuffer()
//             );
//           }

//           // Удаление фона с помощью rembg
//           let img = await rembg.remove(sharpInput);

//           // Зеркалирование, если указано
//           if (mirror === "true") img = img.flop();

//           // Добавление однотонного фона
//           if (!useAlpha) img = img.flatten({ background: bg });

//           // Конвертация формата
//           switch (format) {
//             case "jpg":
//               img = img.jpeg({ quality: 90 });
//               break;
//             case "webp":
//               img = img.webp({
//                 quality: 75,
//                 alphaQuality: 100,
//                 lossless: false,
//                 effort: 4,
//               });
//               break;
//             default:
//               img = img.png({ quality: 75 });
//           }

//           // Сохраняем файл и удаляем оригинал
//           await fs.promises.writeFile(outputPath, await img.toBuffer());
//           await fs.promises.unlink(file.path);

//           // Успешный результат
//           results.push({
//             originalName: file.originalname,
//             processedName: filename,
//             downloadUrl: `/api/download/${filename}`,
//           });
//         } catch (err) {
//           // Обработка ошибки
//           console.error(`❌ Error: ${file.originalname}`, err);
//           results.push({
//             originalName: file.originalname,
//             error: true,
//             message: err.message,
//           });

//           // Удаляем файл, если остался
//           if (fs.existsSync(file.path)) await fs.promises.unlink(file.path);
//         }
//       })
//     )
//   );

//   // Отправляем клиенту список обработанных файлов
//   res.json({ files: results });
// });

// export default router;
