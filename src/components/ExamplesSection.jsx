import React from "react";
import { Image as ImageIcon, ArrowRight } from "lucide-react";
import Image from "next/image";

const ExamplesSection = () => {
  return (
    <div id="examples" className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          Примеры обработки
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Посмотрите на результаты работы с различными настройками обработки
        </p>
      </div>

      <div className="space-y-8">
        {/* Example 1: Transparent Background */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-800/30">
          <div className="p-6 border-b border-purple-800/30">
            <h3 className="text-xl font-semibold text-white mb-2">
              Прозрачный фон
            </h3>
            <p className="text-gray-400 text-sm">
              Идеально для наложения на любой фон или дизайн
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-center space-x-8">
              {/* Before */}
              <div className="text-center">
                <div className="w-48 h-48 bg-gray-800 rounded-xl overflow-hidden mb-4">
                  <Image
                    src="/assets/1.webp"
                    alt="До обработки"
                    className="w-full h-full object-cover"
                    width={192}
                    height={192}
                  />
                </div>
                <p className="text-sm text-gray-400">Исходное изображение</p>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0">
                <ArrowRight className="w-8 h-8 text-purple-400" />
              </div>

              {/* After */}
              <div className="text-center">
                <div
                  className="w-48 h-48 rounded-xl overflow-hidden mb-4 relative"
                  style={{
                    background:
                      "repeating-conic-gradient(#e5e5e5 0% 25%, #f5f5f5 0% 50%) 50% / 20px 20px",
                  }}
                >
                  <Image
                    src="/assets/img-1.webp"
                    alt="После обработки"
                    width={192}
                    height={192}
                  />
                </div>
                <p className="text-sm text-gray-400">Прозрачный фон PNG</p>
              </div>
            </div>

            <div className="mt-6 bg-gray-800/50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Настройки:</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Формат: PNG</li>
                    <li>• Фон: Прозрачный</li>
                    <li>• Отзеркаливание: Выкл</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Результат:</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Готов для любого дизайна</li>
                    <li>• Сохранена прозрачность</li>
                    <li>• Высокое качество краев</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Example 2: Colored Background */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-800/30">
          <div className="p-6 border-b border-purple-800/30">
            <h3 className="text-xl font-semibold text-white mb-2">
              Цветной фон
            </h3>
            <p className="text-gray-400 text-sm">
              Единый стиль для каталога товаров или портфолио
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-center space-x-8">
              {/* Before */}
              <div className="text-center">
                <div className="w-48 h-48 bg-gray-800 rounded-xl overflow-hidden mb-4">
                  <Image
                    src="/assets/2.webp"
                    alt="До обработки"
                    className="w-full h-full object-cover"
                    width={192}
                    height={192}
                  />
                </div>
                <p className="text-sm text-gray-400">Исходное изображение</p>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0">
                <ArrowRight className="w-8 h-8 text-purple-400" />
              </div>

              {/* After */}
              <div className="text-center">
                <div
                  className="w-48 h-48 rounded-xl overflow-hidden mb-4 flex items-center justify-center"
                  style={{ backgroundColor: "#8B5CF6" }}
                >
                  <Image
                    src="/assets/img-2.webp"
                    alt="После обработки"
                    className="w-full h-full object-cover"
                    width={192}
                    height={192}
                  />
                </div>
                <p className="text-sm text-gray-400">Фиолетовый фон JPG</p>
              </div>
            </div>

            <div className="mt-6 bg-gray-800/50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Настройки:</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Формат: JPG</li>
                    <li>• Фон: #8B5CF6</li>
                    <li>• Отзеркаливание: Выкл</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Результат:</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Единый стиль каталога</li>
                    <li>• Меньший размер файла</li>
                    <li>• Профессиональный вид</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Example 3: Mirrored */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-800/30">
          <div className="p-6 border-b border-purple-800/30">
            <h3 className="text-xl font-semibold text-white mb-2">
              Отзеркаленное изображение
            </h3>
            <p className="text-gray-400 text-sm">
              Создание симметричных композиций и уникальных ракурсов
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-center space-x-8">
              {/* Before */}
              <div className="text-center">
                <div className="w-48 h-48 bg-gray-800 rounded-xl overflow-hidden mb-4">
                  <Image
                    src="/assets/3.avif"
                    alt="До обработки"
                    className="w-full h-full object-cover"
                    width={192}
                    height={192}
                  />
                </div>
                <p className="text-sm text-gray-400">Исходное изображение</p>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0">
                <ArrowRight className="w-8 h-8 text-purple-400" />
              </div>

              {/* After */}
              <div className="text-center">
                <div
                  className="w-48 h-48 rounded-xl overflow-hidden mb-4 relative"
                  style={{
                    background:
                      "repeating-conic-gradient(#e5e5e5 0% 25%, #f5f5f5 0% 50%) 50% / 20px 20px",
                  }}
                >
                  <Image
                    src="/assets/img-3.png"
                    alt="После обработки"
                    className="w-full h-full object-cover"
                    width={192}
                    height={192}
                  />
                </div>
                <p className="text-sm text-gray-400">
                  Отзеркалено + прозрачный фон
                </p>
              </div>
            </div>

            <div className="mt-6 bg-gray-800/50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Настройки:</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Формат: PNG</li>
                    <li>• Фон: Прозрачный</li>
                    <li>• Отзеркаливание: Вкл</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Результат:</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Уникальный ракурс</li>
                    <li>• Симметричные композиции</li>
                    <li>• Творческие возможности</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamplesSection;
