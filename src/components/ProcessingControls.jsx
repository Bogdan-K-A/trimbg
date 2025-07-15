import React from "react";
import {
  Download,
  Play,
  Pause,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import axios from "axios";

const mainUrl =
  process.env.NEXT_PUBLIC_LOCAL_URL === undefined
    ? process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_LOCAL_URL;

const ProcessingControls = ({
  images,
  isProcessing,
  handleProcess,
  zipRef,
  onCancel,
  setImages,
}) => {
  const removeImages = () => {
    setImages([]);
  };

  const downloadAll = async () => {
    if (!zipRef.current) return alert("Обработка не завершена");

    try {
      const response = await axios.get(`${mainUrl}${zipRef.current}`, {
        responseType: "blob",
      });

      const blob = response.data;
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "images.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Ошибка при скачивании ZIP:", err);
      alert("ZIP-файл не найден или ошибка при скачивании");
    }
  };

  return (
    <div className="mb-8 flex items-center justify-between bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-800/30">
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-300">
          <span className="font-semibold text-white">{images.length}</span>{" "}
          изображений загружено
          {images.filter((img) => img.status === "completed").length > 0 && (
            <span className="ml-4">
              <span className="font-semibold text-green-400">
                {images.filter((img) => img.status === "completed").length}
              </span>{" "}
              обработано
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-3">
        {!isProcessing && (
          <button
            onClick={removeImages}
            className="cursor-pointer flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
            <span>Удалить все</span>
          </button>
        )}
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={isProcessing ? onCancel : handleProcess}
          className="cursor-pointer flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-all duration-200"
        >
          {isProcessing ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          <span>{isProcessing ? "Обработка..." : "Обработать все"}</span>
        </button>
        {images.some((img) => img.status === "completed") && (
          <button
            onClick={downloadAll}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-all duration-200 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Скачать все</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProcessingControls;
