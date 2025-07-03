"use client";
import React, { useCallback, useState } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import transliterate from "@/utils/transliterate";

export default function UploadArea({ images, setImages, setShowSettings }) {
  const [dragActive, setDragActive] = useState(false);

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

      const newImages = imageFiles.map((file) => {
        const traslitName = transliterate(file.name);
        return {
          id: Math.random().toString(36).substr(2, 9),
          file,
          original: URL.createObjectURL(file),
          name: traslitName,
          status: "pending",
          progress: 0,
        };
      });

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
    const newImages = files.map((file) => {
      const traslitName = transliterate(file.name);
      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        original: URL.createObjectURL(file),
        name: traslitName,
        status: "pending",
        progress: 0,
      };
    });

    setImages((prev) => [...prev, ...newImages]);
    // Автоматически показываем настройки при первой загрузке
    if (images.length === 0 && newImages.length > 0) {
      setShowSettings(true);
    }
  };

  return (
    <div className="mb-8" id="home">
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
  );
}
