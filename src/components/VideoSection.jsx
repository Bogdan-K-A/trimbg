import React from "react";
import {
  Upload,
  Download,
  Settings,
  Image as ImageIcon,
  PlayCircle,
} from "lucide-react";

const VideoSection = () => {
  return (
    <div id="demo" className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          Посмотрите как это работает
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Демонстрация процесса удаления фона с изображений в реальном времени
        </p>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-800/30">
        <div className="aspect-video bg-gray-800 relative group">
          {/* Video placeholder with play button */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all duration-300 cursor-pointer">
                <PlayCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Демонстрация работы
              </h3>
              <p className="text-gray-300 text-sm">
                Нажмите для просмотра видео
              </p>
            </div>
          </div>

          {/* Actual video element (hidden by default, would be shown when play is clicked) */}
          <video
            className="w-full h-full object-cover opacity-0"
            poster="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200"
            controls
          >
            <source src="#" type="video/mp4" />
            Ваш браузер не поддерживает видео.
          </video>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">
                1. Загрузите изображения
              </h4>
              <p className="text-sm text-gray-400">
                Перетащите файлы или выберите их с устройства
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">
                2. Настройте параметры
              </h4>
              <p className="text-sm text-gray-400">
                Выберите формат, цвет фона и другие опции
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Download className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">
                3. Скачайте результат
              </h4>
              <p className="text-sm text-gray-400">
                Получите обработанные изображения без фона
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;
