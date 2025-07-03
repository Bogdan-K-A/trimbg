import React from "react";
import { Image as ImageIcon, Target } from "lucide-react";

const CasesDescription = () => {
  return (
    <div
      id="use-cases"
      className="mb-12 bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-800/30"
    >
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
        <Target className="w-5 h-5" />
        <span>Для каких целей я могу использовать этот инструмент?</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* E-commerce */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-3">
            <span className="text-lg">🛍️</span>
          </div>
          <h4 className="font-semibold text-white mb-2">Интернет-магазины</h4>
          <p className="text-sm text-gray-400 mb-3">
            Создание единого стиля для каталога товаров
          </p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• Товары на белом фоне</li>
            <li>• Профессиональный вид</li>
            <li>• Увеличение продаж</li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg flex items-center justify-center mb-3">
            <span className="text-lg">📱</span>
          </div>
          <h4 className="font-semibold text-white mb-2">Социальные сети</h4>
          <p className="text-sm text-gray-400 mb-3">
            Создание контента для Instagram, TikTok, Facebook
          </p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• Стильные посты</li>
            <li>• Брендинг профиля</li>
            <li>• Креативные коллажи</li>
          </ul>
        </div>

        {/* Design */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center mb-3">
            <span className="text-lg">🎨</span>
          </div>
          <h4 className="font-semibold text-white mb-2">Дизайн и реклама</h4>
          <p className="text-sm text-gray-400 mb-3">
            Подготовка изображений для макетов и рекламы
          </p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• Баннеры и флаеры</li>
            <li>• Презентации</li>
            <li>• Веб-дизайн</li>
          </ul>
        </div>

        {/* Photography */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mb-3">
            <span className="text-lg">📸</span>
          </div>
          <h4 className="font-semibold text-white mb-2">Фотография</h4>
          <p className="text-sm text-gray-400 mb-3">
            Обработка портретов и студийных снимков
          </p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• Портретная съемка</li>
            <li>• Студийные фото</li>
            <li>• Семейные снимки</li>
          </ul>
        </div>

        {/* Business */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg flex items-center justify-center mb-3">
            <span className="text-lg">💼</span>
          </div>
          <h4 className="font-semibold text-white mb-2">Бизнес</h4>
          <p className="text-sm text-gray-400 mb-3">
            Корпоративные материалы и документация
          </p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• Фото сотрудников</li>
            <li>• Корпоративные сайты</li>
            <li>• Презентации</li>
          </ul>
        </div>

        {/* Personal */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-3">
            <span className="text-lg">✨</span>
          </div>
          <h4 className="font-semibold text-white mb-2">
            Личное использование
          </h4>
          <p className="text-sm text-gray-400 mb-3">
            Обработка личных фотографий и творчество
          </p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• Аватары и профили</li>
            <li>• Творческие проекты</li>
            <li>• Подарки и открытки</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CasesDescription;
