// 📁 Импорт асинхронного API для работы с файловой системой
import fs from "fs/promises";

// 📁 Импорт модуля path для безопасной работы с путями (кроссплатформенно)
import path from "path";

// 🧹 Функция для удаления файлов, которые старше заданного времени (по умолчанию 60 минут)
export async function clearOldFiles(dirPath, maxAgeMinutes = 60) {
  const now = Date.now(); // ⏱️ Текущее время в миллисекундах

  // 📄 Читаем список всех файлов в указанной папке
  const files = await fs.readdir(dirPath);

  // 🔁 Проходим по каждому файлу
  for (const file of files) {
    const fullPath = path.join(dirPath, file); // 🧭 Полный путь к файлу
    const stats = await fs.stat(fullPath); // 📊 Получаем метаданные (в том числе время изменения)

    // ⌛ Вычисляем, сколько минут прошло с момента последнего изменения файла
    const ageMinutes = (now - stats.mtimeMs) / 60000;

    // 🗑️ Если файл старше заданного лимита — удаляем его
    if (ageMinutes > maxAgeMinutes) {
      try {
        await fs.unlink(fullPath); // ❌ Удаляем файл
        console.log("🗑️ Удалён:", fullPath); // ✅ Лог успешного удаления
      } catch (e) {
        // ⚠️ Логируем ошибку, если не удалось удалить файл
        console.error("❌ Ошибка удаления:", e.message);
      }
    }
  }
}
