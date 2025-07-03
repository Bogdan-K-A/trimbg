"use client";
import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  Upload,
  Download,
  Trash2,
  Settings,
  Play,
  Pause,
  Check,
  X,
  Image as ImageIcon,
  Zap,
  PlayCircle,
  ArrowRight,
  FileImage,
  Sparkles,
  Target,
  ChevronUp,
} from "lucide-react";

function Home2() {
  const [images, setImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [settings, setSettings] = useState({
    useColorBackground: false,
    backgroundColor: "#8B5CF6",
    outputFormat: "JPG",
    enableMirror: false,
  });

  // Handle scroll to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));

      const newImages = imageFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        original: URL.createObjectURL(file),
        name: file.name,
        status: "pending",
        progress: 0,
      }));

      setImages((prev) => [...prev, ...newImages]);
      // Автоматически показываем настройки при первой загрузке
      if (images.length === 0 && newImages.length > 0) {
        setShowSettings(true);
      }
    },
    [images.length]
  );

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      original: URL.createObjectURL(file),
      name: file.name,
      status: "pending",
      progress: 0,
    }));

    setImages((prev) => [...prev, ...newImages]);
    // Автоматически показываем настройки при первой загрузке
    if (images.length === 0 && newImages.length > 0) {
      setShowSettings(true);
    }
  };

  const simulateProcessing = async () => {
    setIsProcessing(true);

    for (const image of images.filter((img) => img.status === "pending")) {
      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id ? { ...img, status: "processing" } : img
        )
      );

      // Simulate processing with progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setImages((prev) =>
          prev.map((img) => (img.id === image.id ? { ...img, progress } : img))
        );
      }

      // Mark as completed
      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id
            ? {
                ...img,
                status: "completed",
                processed: img.original, // In real app, this would be the processed image
                progress: 100,
              }
            : img
        )
      );
    }

    setIsProcessing(false);
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const downloadAll = () => {
    const completedImages = images.filter((img) => img.status === "completed");
    // In a real app, this would trigger download of all processed images
    console.log("Downloading", completedImages.length, "processed images");
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Title and Description */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            BackgroundPro
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Профессиональное удаление фона с изображений
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Автоматически удаляйте фон с ваших изображений с помощью
            искусственного интеллекта. Поддержка пакетной обработки, различных
            форматов и настраиваемых параметров вывода.
          </p>

          {/* Settings Button - показываем только когда есть изображения */}
          {images.length > 0 && (
            <div className="mt-8">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`inline-flex items-center space-x-2 px-6 py-3 rounded-xl border transition-all duration-200 ${
                  showSettings
                    ? "bg-purple-600/30 border-purple-500/50 text-purple-300"
                    : "bg-purple-600/20 hover:bg-purple-600/30 border-purple-500/30"
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Настройки обработки</span>
              </button>
            </div>
          )}
        </div>

        {/* Upload Area */}
        <div className="mb-8">
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              dragActive
                ? "border-pink-400 bg-pink-500/10 scale-[1.02]"
                : "border-purple-600/40 hover:border-purple-500/60 hover:bg-purple-500/5"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Перетащите изображения сюда
                </h3>
                <p className="text-gray-400 mb-4">
                  Поддержка PNG, JPG, JPEG. Обработка до 100 изображений
                  одновременно.
                </p>
              </div>
              <label className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-xl font-semibold cursor-pointer transition-all duration-200 transform hover:scale-105">
                Выбрать файлы
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInput}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        {images.length > 0 && showSettings && (
          <div className="mb-8 bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-800/30">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Настройки обработки</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Color Background Toggle */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">
                  Цветной фон
                </label>
                <button
                  onClick={() =>
                    updateSetting(
                      "useColorBackground",
                      !settings.useColorBackground
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.useColorBackground
                      ? "bg-purple-600"
                      : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.useColorBackground
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Background Color Picker */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">
                  Цвет фона
                </label>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-8 h-8 rounded-lg border-2 border-gray-600"
                    style={{ backgroundColor: settings.backgroundColor }}
                  ></div>
                  <input
                    type="color"
                    value={settings.backgroundColor}
                    onChange={(e) =>
                      updateSetting("backgroundColor", e.target.value)
                    }
                    disabled={!settings.useColorBackground}
                    className="w-16 h-8 bg-transparent border border-gray-600 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Mirror Toggle */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">
                  Отзеркалить
                </label>
                <button
                  onClick={() =>
                    updateSetting("enableMirror", !settings.enableMirror)
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.enableMirror ? "bg-purple-600" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.enableMirror ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Output Format */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">
                  Формат файла
                </label>
                <select
                  value={settings.outputFormat}
                  onChange={(e) =>
                    updateSetting("outputFormat", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                >
                  <option value="JPG">JPG</option>
                  <option value="PNG">PNG</option>
                  <option value="WEBP">WEBP</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* File Formats Description */}
        <div className="mb-12 bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-800/30">
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

        {/* Use Cases Section */}
        <div className="mb-12 bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-800/30">
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
              <h4 className="font-semibold text-white mb-2">
                Интернет-магазины
              </h4>
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
              <h4 className="font-semibold text-white mb-2">
                Дизайн и реклама
              </h4>
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

        {/* Processing Controls */}
        {images.length > 0 && (
          <div className="mb-8 flex items-center justify-between bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-800/30">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-300">
                <span className="font-semibold text-white">
                  {images.length}
                </span>{" "}
                изображений загружено
                {images.filter((img) => img.status === "completed").length >
                  0 && (
                  <span className="ml-4">
                    <span className="font-semibold text-green-400">
                      {
                        images.filter((img) => img.status === "completed")
                          .length
                      }
                    </span>{" "}
                    обработано
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={simulateProcessing}
                disabled={
                  isProcessing ||
                  images.every((img) => img.status === "completed")
                }
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-all duration-200"
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
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-all duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span>Скачать все</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Images Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {images.map((image) => (
              <div
                key={image.id}
                className="bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-800/30 hover:border-purple-600/50 transition-all duration-200"
              >
                <div className="aspect-video bg-gray-800 relative overflow-hidden">
                  <Image
                    src={image.original}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                  {image.status === "processing" && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mb-3"></div>
                        <div className="text-sm font-semibold">
                          {image.progress}%
                        </div>
                      </div>
                    </div>
                  )}
                  {image.status === "completed" && (
                    <div className="absolute top-3 right-3">
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
                        {image.name}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            image.status === "pending"
                              ? "bg-yellow-500"
                              : image.status === "processing"
                              ? "bg-blue-500"
                              : image.status === "completed"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <span className="text-xs text-gray-400 capitalize">
                          {image.status === "pending"
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
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
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
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg transition-all duration-200">
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Скачать</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video Demo Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Посмотрите как это работает
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Демонстрация процесса удаления фона с изображений в реальном
              времени
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

        {/* Examples Section */}
        <div className="mb-16">
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
                    <p className="text-sm text-gray-400">
                      Исходное изображение
                    </p>
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
                        className="w-full h-full object-cover"
                        // style={{
                        //   filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))",
                        // }}
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
                      <h4 className="font-semibold text-white mb-2">
                        Настройки:
                      </h4>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• Формат: PNG</li>
                        <li>• Фон: Прозрачный</li>
                        <li>• Отзеркаливание: Выкл</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">
                        Результат:
                      </h4>
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
                    <p className="text-sm text-gray-400">
                      Исходное изображение
                    </p>
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
                      <h4 className="font-semibold text-white mb-2">
                        Настройки:
                      </h4>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• Формат: JPG</li>
                        <li>• Фон: #8B5CF6</li>
                        <li>• Отзеркаливание: Выкл</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">
                        Результат:
                      </h4>
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
                    <p className="text-sm text-gray-400">
                      Исходное изображение
                    </p>
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
                      <h4 className="font-semibold text-white mb-2">
                        Настройки:
                      </h4>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• Формат: PNG</li>
                        <li>• Фон: Прозрачный</li>
                        <li>• Отзеркаливание: Вкл</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">
                        Результат:
                      </h4>
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

        {/* Empty State */}
        {images.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-300">
              Готов к обработке ваших изображений
            </h3>
            <p className="text-gray-500">
              Загрузите изображения, чтобы начать профессиональное удаление фона
            </p>
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50"
          aria-label="Наверх"
        >
          <ChevronUp className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
}

export default Home2;
