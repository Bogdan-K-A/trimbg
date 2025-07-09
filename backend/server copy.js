import archiver from "archiver"; // создание ZIP-архивов
import multer from "multer"; // загрузка файлов
import sharp from "sharp"; // обработка изображений
import cors from "cors"; // разрешение CORS
import pLimit from "p-limit"; // ограничение количества одновременных задач
import fs, { mkdirSync, createWriteStream, existsSync } from "fs"; // файловая система
import { clearOldFiles } from "./utils/clearOldFiles.js"; // автоочистка старых файлов
import { createRequire } from "module"; // для использования require в ES-модулях
import { randomUUID } from "crypto"; // генерация уникального ID
import express from "express"; // веб-сервер
import path from "path"; // работа с путями

const limit = pLimit(2); // максимум 2 параллельные задачи

// Подключение Rembg-модуля для удаления фона
const require = createRequire(import.meta.url);
const { Rembg } = require("rembg-node");
const rembg = new Rembg();

// Создание директорий, если их нет
const uploadDir = "tmp";
const processedDir = "processed";
const zipDir = "zips";
mkdirSync(uploadDir, { recursive: true });
mkdirSync(processedDir, { recursive: true });
mkdirSync(zipDir, { recursive: true });

// Настройка загрузчика файлов
const upload = multer({ dest: uploadDir });

const app = express();
const PORT = 4000;

// Мидлвары
app.use(cors()); // разрешить все запросы
app.use(express.json()); // парсинг JSON-запросов

// 🎯 Обработка изображений — до 5 файлов за раз
app.post("/process", upload.array("files", 5), async (req, res) => {
  // Достаём настройки и файлы из запроса
  const { color = "transparent", mirror, format = "png" } = req.body;
  const files = req.files;

  // Если нет файлов — ошибка
  if (!files?.length)
    return res.status(400).json({ error: "No files uploaded" });

  // Определение прозрачного фона
  const useAlpha = color === "transparent" && format !== "jpg";

  // Если фон не прозрачный — преобразуем HEX в RGB
  let bg = null;
  if (!useAlpha) {
    const [r, g, b] = color
      .replace("#", "")
      .match(/.{2}/g)
      .map((h) => parseInt(h, 16));
    bg = { r, g, b };
  }

  const results = [];

  // Обработка каждого файла с ограничением по параллелизму
  await Promise.all(
    files.map((file, idx) =>
      limit(async () => {
        try {
          // Формирование уникального имени
          const sliceFormat = file.originalname.slice(
            0,
            file.originalname.lastIndexOf(".")
          );
          const filename = `${sliceFormat}-${idx + 1}.${format}`;
          const outputPath = path.join(processedDir, filename);

          // Чтение файла
          const inputBuffer = await fs.promises.readFile(file.path);
          let sharpInput = sharp(inputBuffer);
          const metadata = await sharpInput.metadata();

          // Сжатие изображения при необходимости
          if (inputBuffer.length > 5 * 1024 * 1024 || metadata.width > 1000) {
            const resizedBuffer = await sharpInput
              .resize({ width: 1000 })
              .toBuffer();
            sharpInput = sharp(resizedBuffer);
          }

          // Удаление фона
          const sharpNoBg = await rembg.remove(sharpInput);
          let img = sharpNoBg;

          // Зеркалирование, если выбрано
          if (mirror === "true") img = img.flop();

          // Наложение фона, если не прозрачный
          if (!useAlpha) img = img.flatten({ background: bg });

          // Преобразование в нужный формат
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

          // Сохранение обработанного файла
          const outputBuffer = await img.toBuffer();
          await fs.promises.writeFile(outputPath, outputBuffer);
          await fs.promises.unlink(file.path); // удаляем оригинал

          // Добавление результата
          results.push({
            originalName: file.originalname,
            processedName: filename,
            downloadUrl: `http://localhost:${PORT}/download/${filename}`,
          });
        } catch (err) {
          // Ошибка при обработке одного из файлов
          console.error(
            `❌ Ошибка обработки "${file.originalname}":`,
            err.message
          );
          results.push({
            originalName: file.originalname,
            error: true,
            message: err.message,
          });

          // Удаляем файл, если остался
          if (fs.existsSync(file.path)) {
            await fs.promises.unlink(file.path);
          }
        }
      })
    )
  );

  return res.json({ files: results }); // отправка результатов на фронт
});

// 📦 Генерация ZIP-файла из списка файлов
app.post("/generate-zip", express.json(), async (req, res) => {
  const { files } = req.body;

  if (!files?.length) {
    return res.status(400).json({ error: "No files provided" });
  }

  const zipFilename = `images-${randomUUID()}.zip`;
  const zipPath = path.join(zipDir, zipFilename);
  const archive = archiver("zip", { zlib: { level: 9 } });
  const output = createWriteStream(zipPath);
  archive.pipe(output); // поток архива в файл

  try {
    // Добавление файлов в архив
    for (const file of files) {
      const filePath = path.join(processedDir, file);
      if (existsSync(filePath)) {
        archive.file(filePath, { name: file });
      }
    }

    // Финализируем архив
    await archive.finalize();

    // Отправляем ссылку после завершения
    output.on("close", () => {
      return res.json({
        zipUrl: `http://localhost:${PORT}/zip/${zipFilename}`,
      });
    });

    // Обработка ошибок архивации
    archive.on("error", (err) => {
      console.error("Archive error:", err);
      if (!res.headersSent) res.status(500).json({ error: err.message });
    });
  } catch (e) {
    console.error("ZIP creation error:", e);
    if (!res.headersSent) res.status(500).json({ error: e.message });
  }
});

// 🖼️ Скачивание одного обработанного файла
app.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(processedDir, filename);
  if (existsSync(filePath)) {
    res.download(filePath); // скачиваем файл
  } else {
    res.status(404).send("Файл не найден");
  }
});

// 📥 Скачивание ZIP-архива
app.get("/zip/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(zipDir, filename);
  if (existsSync(filePath)) {
    res.download(filePath); // скачиваем ZIP
  } else {
    res.status(404).send("Архив не найден");
  }
});

// ▶️ Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);

  // 🔁 Очистка старых файлов каждые 10 минут
  setInterval(() => {
    clearOldFiles(processedDir, 60); // удаление старых картинок
    clearOldFiles(zipDir, 60); // удаление старых архивов
  }, 10 * 60 * 1000);
});

// =================================

// import { createRequire } from "module";
// import express from "express";
// import multer from "multer";
// import archiver from "archiver";
// import sharp from "sharp";
// import fs, { mkdirSync, createWriteStream, existsSync } from "fs";
// import cors from "cors";
// import { randomUUID } from "crypto";
// import path from "path";
// import pLimit from "p-limit";
// import clearOldFiles from "./utils/clearOldFiles.js";

// const limit = pLimit(2); // максимум 2 одновременные задачи

// const require = createRequire(import.meta.url);
// const { Rembg } = require("rembg-node");
// const rembg = new Rembg();

// const uploadDir = "tmp";
// const processedDir = "processed";
// const zipDir = "zips";

// mkdirSync(uploadDir, { recursive: true });
// mkdirSync(processedDir, { recursive: true });
// mkdirSync(zipDir, { recursive: true });

// const upload = multer({ dest: uploadDir });

// const app = express();
// const PORT = 4000;

// app.use(cors());
// app.use(express.json());

// // 🎯 Обработка до 5 файлов за один запрос
// app.post("/process", upload.array("files", 5), async (req, res) => {
//   const { color = "transparent", mirror, format = "png" } = req.body;
//   const files = req.files;

//   if (!files?.length)
//     return res.status(400).json({ error: "No files uploaded" });

//   const useAlpha = color === "transparent" && format !== "jpg";

//   let bg = null;
//   if (!useAlpha) {
//     const [r, g, b] = color
//       .replace("#", "")
//       .match(/.{2}/g)
//       .map((h) => parseInt(h, 16));
//     bg = { r, g, b };
//   }

//   const results = [];

//   await Promise.all(
//     files.map((file, idx) =>
//       limit(async () => {
//         try {
//           const sliceFormat = file.originalname.slice(
//             0,
//             file.originalname.lastIndexOf(".")
//           );

//           const filename = `${sliceFormat}-${idx + 1}.${format}`;
//           const uniqueFilename = `${filename}`;
//           const outputPath = path.join(processedDir, uniqueFilename);

//           const inputBuffer = await fs.promises.readFile(file.path);
//           let sharpInput = sharp(inputBuffer);
//           const metadata = await sharpInput.metadata();

//           // Сжатие, если больше 5MB или шире 1000px
//           if (inputBuffer.length > 5 * 1024 * 1024 || metadata.width > 1000) {
//             const resizedBuffer = await sharpInput
//               .resize({ width: 1000 })
//               .toBuffer();
//             sharpInput = sharp(resizedBuffer);
//           }

//           const sharpNoBg = await rembg.remove(sharpInput);

//           let img = sharpNoBg;

//           if (mirror === "true") img = img.flop();
//           if (!useAlpha) img = img.flatten({ background: bg });

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

//           const outputBuffer = await img.toBuffer();

//           await fs.promises.writeFile(outputPath, outputBuffer);
//           await fs.promises.unlink(file.path);

//           results.push({
//             originalName: file.originalname,
//             processedName: uniqueFilename,
//             downloadUrl: `http://localhost:${PORT}/download/${uniqueFilename}`,
//           });
//         } catch (err) {
//           console.error(
//             `❌ Ошибка обработки "${file.originalname}":`,
//             err.message
//           );
//           results.push({
//             originalName: file.originalname,
//             error: true,
//             message: err.message,
//           });

//           if (fs.existsSync(file.path)) {
//             await fs.promises.unlink(file.path);
//           }
//         }
//       })
//     )
//   );

//   return res.json({ files: results });
// });

// // 📦 Создание ZIP-файла из списка обработанных файлов
// app.post("/generate-zip", express.json(), async (req, res) => {
//   const { files } = req.body;

//   if (!files?.length) {
//     return res.status(400).json({ error: "No files provided" });
//   }

//   const zipFilename = `images-${randomUUID}.zip`;
//   const zipPath = path.join(zipDir, zipFilename);
//   const archive = archiver("zip", { zlib: { level: 9 } });
//   const output = createWriteStream(zipPath);
//   archive.pipe(output);

//   try {
//     for (const file of files) {
//       const filePath = path.join(processedDir, file);
//       if (existsSync(filePath)) {
//         archive.file(filePath, { name: file });
//       }
//     }

//     await archive.finalize();

//     output.on("close", () => {
//       return res.json({
//         zipUrl: `http://localhost:${PORT}/zip/${zipFilename}`,
//       });
//     });

//     archive.on("error", (err) => {
//       console.error("Archive error:", err);
//       if (!res.headersSent) res.status(500).json({ error: err.message });
//     });
//   } catch (e) {
//     console.error("ZIP creation error:", e);
//     if (!res.headersSent) res.status(500).json({ error: e.message });
//   }
// });

// // 🖼️ Скачивание одной картинки
// app.get("/download/:filename", (req, res) => {
//   const filename = req.params.filename;
//   const filePath = path.join(processedDir, filename);
//   if (existsSync(filePath)) {
//     res.download(filePath);
//   } else {
//     res.status(404).send("Файл не найден");
//   }
// });

// // 📥 Скачивание zip
// app.get("/zip/:filename", (req, res) => {
//   const filename = req.params.filename;
//   const filePath = path.join(zipDir, filename);
//   if (existsSync(filePath)) {
//     res.download(filePath);
//   } else {
//     res.status(404).send("Архив не найден");
//   }
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);

//   // 🔁 Запуск автоочистки каждые 10 минут
//   setInterval(() => {
//     clearOldFiles(processedDir, 60); // удалять картинки старше 60 минут
//     clearOldFiles(zipDir, 60); // удалять ZIP-архивы старше 60 минут
//   }, 10 * 60 * 1000); // каждые 10 минут
// });
