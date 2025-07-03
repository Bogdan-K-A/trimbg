"use client";
import { useState } from "react";
import Image from "next/image";
import { Download, Trash2, Check } from "lucide-react";
import axios from "axios";

export default function ImageCard({ image, removeImage }) {
  const [showAfter, setShowAfter] = useState(true);

  const getImageSrc = () => {
    //   показывает фотку до/после
    if (image.status === "completed" && showAfter && image.processed) {
      return image.processed;
    }
    return image.original;
  };

  const downloadOneImg = async () => {
    if (!image.processed) {
      alert("Файл не готов для скачивания");
      return;
    }

    try {
      const response = await axios.get(image.processed, {
        responseType: "blob",
      });

      const blob = response.data;
      const url = URL.createObjectURL(blob);

      // Получаем расширение из URL
      const extensionMatch = image.processed.match(
        /\.(png|jpe?g|webp)(?=\?|$)/i
      );
      const ext = extensionMatch ? extensionMatch[0] : ".png";
      console.log("ext", ext);

      // Удаляем оригинальное расширение из имени
      const baseName = image.name.replace(/\.[^/.]+$/, "");
      console.log("baseName", baseName);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${baseName}${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Ошибка при скачивании:", err);
      alert("Не удалось скачать изображение");
    }
  };

  const getImageName = () => {
    if (image.status === "completed" && showAfter && image.processed) {
      // Извлекаем расширение из processed URL
      const extMatch = image.processed.match(/\.(png|jpe?g|webp)(?=\?|$)/i);
      const ext = extMatch ? extMatch[0] : ".png";

      // Удаляем оригинальное расширение
      const baseName = image.name.replace(/\.[^/.]+$/, "");

      return `${baseName}${ext}`;
    }

    return image.name;
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-800/30 hover:border-purple-600/50 transition-all duration-200">
      <div className="aspect-video bg-gray-800 relative overflow-hidden">
        <Image
          src={getImageSrc()}
          alt={image.name}
          className="w-full h-full object-cover"
          style={{
            background:
              "repeating-conic-gradient(#e5e5e5 0% 25%, #f5f5f5 0% 50%) 50% / 20px 20px",
          }}
          width={192}
          height={192}
        />
        {image.status === "processing" && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mb-3"></div>
              <div className="text-sm font-semibold">{image.progress}%</div>
            </div>
          </div>
        )}
        {image.status === "completed" && (
          <div className="absolute top-3 right-3 flex space-x-2">
            <button
              onClick={() => setShowAfter((prev) => !prev)}
              className="text-xs bg-black/50 px-2 py-1 rounded text-white hover:bg-black/70 cursor-pointer"
            >
              {!showAfter ? "После" : "До"}
            </button>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {getImageName()}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  image.status === "pending" || image.status === "cancelled"
                    ? "bg-yellow-500"
                    : image.status === "processing"
                    ? "bg-blue-500"
                    : image.status === "completed"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              ></div>
              <span className="text-xs text-gray-400 capitalize">
                {image.status === "pending" || image.status === "cancelled"
                  ? "ожидание"
                  : image.status === "processing"
                  ? "обработка"
                  : image.status === "completed"
                  ? "готово"
                  : "ошибка"}
              </span>
            </div>
          </div>
          <button
            onClick={() => removeImage(image.id)}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {image.status === "processing" && (
          <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
            <div
              className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${image.progress}%` }}
            ></div>
          </div>
        )}

        {image.status === "completed" && (
          <button
            onClick={() => downloadOneImg()}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg transition-all duration-200 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Скачать</span>
          </button>
        )}
      </div>
    </div>
  );
}
