"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import JSZip from "jszip";
import { Image as ImageIcon, Zap, ChevronUp } from "lucide-react";

/* UI‑компоненты */
import UploadArea from "@/components/UploadArea";
import SettingsPanel from "@/components/SettingsPanel";
import FormatDescription from "@/components/FormatDescription";
import CasesDescription from "@/components/CasesDescription";
import ImagesGrid from "@/components/ImagesGrid";
import ProcessingControls from "@/components/ProcessingControls";
import VideoSection from "@/components/VideoSection";
import ExamplesSection from "@/components/ExamplesSection";
import transliterate from "@/utils/transliterate";

export default function Home() {
  /* ------------------------ Состояния ------------------------ */

  const zipRef = useRef(null); // здесь будем хранить zip-файл (ArrayBuffer)
  const [progress, setProgress] = useState(0); // 0–100
  // =========================================
  const [images, setImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [settings, setSettings] = useState({
    useColorBackground: false,
    backgroundColor: "#ffffff",
    outputFormat: "jpg",
    enableMirror: false,
  });
  // =========================================

  const prevUrlsRef = useRef([]); // хранит Object‑URL‑ы прошлого результата, чтобы отзывать и не течь
  const simulatedProgress = useRef({});
  const isCancelled = useRef(false);
  const abortControllerRef = useRef(null);

  const handleCancel = () => {
    isCancelled.current = true;
    setIsProcessing(false);
    Object.values(simulatedProgress.current).forEach(clearInterval);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Сброс статуса и прогресса для обрабатываемых
    setImages((prev) =>
      prev.map((img) =>
        img.status === "processing"
          ? { ...img, status: "cancelled", progress: 0 }
          : img
      )
    );
  };

  const newStartProgress = () => {
    let newImages = [];
    setImages((prev) => {
      const updated = prev.map((img) => {
        if (img.status === "cancelled") {
          const updatedImg = { ...img, status: "pending", progress: 0 };
          newImages.push(updatedImg);
          return updatedImg;
        }
        return img;
      });
      // Добавляем pending, которые уже были
      newImages.push(
        ...updated.filter(
          (img) => img.status === "pending" && !newImages.includes(img)
        )
      );

      return updated;
    });
  };

  /* ------------------------ Обработка изображений ------------------------ */
  const handleProcess = async () => {
    if (!images.length) return alert("Загрузите изображения");

    newStartProgress();

    isCancelled.current = false; // сбрасываем
    setIsProcessing(true);
    setProgress(0);

    simulatedProgress.current = {};
    const batchSize = 5;
    const stepInterval = 100;

    // Установим начальный статус
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        status: "processing",
        progress: 0,
      }))
    );

    // Индивидуальный прогресс
    images.forEach((img) => {
      // if (img.status !== "pending") return;

      let currentProgress = 0;
      simulatedProgress.current[img.name] = setInterval(() => {
        if (isCancelled.current) {
          clearInterval(simulatedProgress.current[img.name]); // остановить таймер
          return; // не продолжаем прогресс
        }

        currentProgress += Math.floor(Math.random() * 6) + 1;
        if (currentProgress >= 97) currentProgress = 97;

        setImages((prev) =>
          prev.map((item) =>
            item.name === img.name
              ? { ...item, progress: currentProgress }
              : item
          )
        );
      }, stepInterval);
    });

    const allProcessed = [];

    try {
      for (let i = 0; i < images.length; i += batchSize) {
        if (isCancelled.current) {
          console.log("⏹️ Обработка остановлена пользователем");
          alert("⏹️ Обработка остановлена пользователем");
          break; // полностью прерываем цикл
        }

        const batch = images.slice(i, i + batchSize);
        const form = new FormData();
        batch.forEach(({ file }) => {
          const traitName = transliterate(file.name);
          const renamedFile = new File([file], traitName, { type: file.type });
          form.append("files", renamedFile);
        });
        form.append(
          "color",
          settings.useColorBackground ? settings.backgroundColor : "transparent"
        );
        form.append("mirror", settings.enableMirror);
        form.append("format", settings.outputFormat);

        abortControllerRef.current = new AbortController();

        const response = await axios.post(
          "http://localhost:4000/api/process",
          form,
          {
            headers: { "Content-Type": "multipart/form-data" },
            signal: abortControllerRef.current.signal,
          }
        );

        const { files } = response.data;
        allProcessed.push(...files);

        // Обновляем статус только картинок из этой партии
        setImages((prev) =>
          prev.map((img) => {
            const match = files.find((f) => f.originalName === img.name);

            if (match) {
              clearInterval(simulatedProgress.current[img.name]);
              delete simulatedProgress.current[img.name];
              return {
                ...img,
                progress: 100,
                status: match.error ? "error" : "completed",
                processed: match.downloadUrl
                  ? `${match.downloadUrl}?v=${Date.now()}`
                  : null,
              };
            }

            if (batch.some((b) => b.name === img.name)) {
              clearInterval(simulatedProgress.current[img.name]);
              delete simulatedProgress.current[img.name];
              return {
                ...img,
                progress: 100,
                status: "error",
              };
            }

            return img;
          })
        );
      }

      // Получаем итоговое состояние изображений после всех батчей
      const failed = allProcessed.filter((f) => f.error);

      if (failed.length > 0) {
        console.warn("❌ Некоторые изображения не обработались:", failed);
        alert(`Некоторые изображения не обработались. Проверьте ошибки.`);
      } else {
        alert("Обработка завершена");
      }

      // ZIP только из успешно обработанных
      const processedNames = allProcessed
        .filter((f) => !f.error)
        .map((f) => f.processedName);

      if (processedNames.length) {
        const zipRes = await axios.post(
          "http://localhost:4000/api/generate-zip",
          {
            files: processedNames,
          }
        );
        zipRef.current = zipRes.data.zipUrl;
      }

      prevUrlsRef.current = [];

      setTimeout(() => setProgress(0), 1000);
      setIsProcessing(false);
    } catch (err) {
      if (
        axios.isCancel?.(err) ||
        err.name === "CanceledError" ||
        err.name === "AbortError"
      ) {
        console.warn("🚫 Запрос отменён пользователем");
      } else {
        alert("Сервер накрылся 1");
        // alert(err.response?.data?.error ?? err.message);
      }

      Object.values(simulatedProgress.current).forEach(clearInterval);
      simulatedProgress.current = {};
      setProgress(0);
      setIsProcessing(false);

      // alert("⏹️ Обработка остановлена пользователем");
      if (isCancelled.current) {
        alert("⏹️ Обработка остановлена пользователем");
      } else {
        alert("Сервер накрылся 2");
      }
      // alert(err.response?.data?.error ?? err.message);
    }
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          window.scrollTo({
            top: el.offsetTop - 80,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, []);

  //  Handle scroll to show/hide scroll to top button
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

  // ================================
  return (
    <main
      // className="p-6 space-y-4 max-w-3xl mx-auto"
      className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white"
    >
      {/* ============================================= */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Title and Description */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent h-15">
            {/* <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"> */}
            TrimBg.pro
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Профессиональное удаление фона с изображений
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Автоматически удаляйте фон с ваших изображений с помощью
            искусственного интеллекта. Поддержка пакетной обработки, различных
            форматов и настраиваемых параметров вывода.
          </p>
        </div>

        {/* Upload Area */}
        <UploadArea
          images={images}
          setImages={setImages}
          setShowSettings={setShowSettings}
        />

        {/* Settings Section */}
        {images.length > 0 && showSettings && (
          <SettingsPanel settings={settings} setSettings={setSettings} />
        )}

        {/* Processing Controls */}
        {images.length > 0 && (
          <ProcessingControls
            images={images}
            isProcessing={isProcessing}
            handleProcess={handleProcess}
            setImages={setImages}
            zipRef={zipRef}
            onCancel={handleCancel}
          />
        )}
        {/* Images Grid */}
        {images.length > 0 && (
          <ImagesGrid
            images={images}
            setImages={setImages}
            progress={progress}
          />
        )}

        {/* File Formats Description */}
        <FormatDescription />
        {/* Use Cases Section */}
        <CasesDescription />
        {/* Video Demo Section */}
        <VideoSection />
        {/* Examples Section */}
        <ExamplesSection />

        {/* Empty State */}
        {images.length === 0 && (
          <div className="text-center py-16" onClick={scrollToTop}>
            <div className="w-24 h-24 bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="w-12 h-12 text-purple-400 cursor-pointer" />
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
    </main>
  );
}
