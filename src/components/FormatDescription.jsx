import React from "react";
import { Image as ImageIcon, FileImage, Sparkles } from "lucide-react";

const FormatDescription = () => {
  return (
    <div
      id="formats"
      className="mb-12 bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-800/30"
    >
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
        <FileImage className="w-5 h-5" />
        <span>Форматы файлов</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* JPG */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-xs font-bold text-white">JPG</span>
            </div>
            <h4 className="font-semibold text-white">JPEG</h4>
          </div>
          <p className="text-sm text-gray-400 mb-3">
            Стандартный формат для фотографий с отличным сжатием
          </p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• Малый размер файла</li>
            <li>• Широкая совместимость</li>
            <li>• Без поддержки прозрачности</li>
            <li>• Идеален для цветных фонов</li>
          </ul>
        </div>

        {/* PNG */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-xs font-bold text-white">PNG</span>
            </div>
            <h4 className="font-semibold text-white">PNG</h4>
          </div>
          <p className="text-sm text-gray-400 mb-3">
            Формат без потерь с поддержкой прозрачности
          </p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• Поддержка прозрачности</li>
            <li>• Высокое качество</li>
            <li>• Больший размер файла</li>
            <li>• Лучший для дизайна</li>
          </ul>
        </div>

        {/* WEBP - Highlighted */}
        <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-4 relative">
          <div className="absolute top-2 right-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-xs font-bold text-white">WP</span>
            </div>
            <h4 className="font-semibold text-white">WebP</h4>
            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
              Рекомендуем
            </span>
          </div>
          <p className="text-sm text-gray-300 mb-3">
            <strong>Современный формат</strong> с лучшим сжатием и качеством
          </p>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>
              • <strong>На 25-35% меньше размер</strong>
            </li>
            <li>• Поддержка прозрачности</li>
            <li>• Отличное качество</li>
            <li>• Быстрая загрузка в веб</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FormatDescription;
