import { HexColorPicker } from "react-colorful";
import { Settings, Image as ImageIcon } from "lucide-react";
export default function SettingsPanel({ settings, setSettings }) {
  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="mb-8 bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-800/30">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
        <Settings className="w-5 h-5" />
        <span>Настройки обработки</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Color Background Toggle */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300 ">
            Цветной фон
          </label>
          <button
            onClick={() =>
              updateSetting("useColorBackground", !settings.useColorBackground)
            }
            className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.useColorBackground ? "bg-purple-600" : "bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.useColorBackground ? "translate-x-6" : "translate-x-1"
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
              onChange={(e) => updateSetting("backgroundColor", e.target.value)}
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
            className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
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
            onChange={(e) => updateSetting("outputFormat", e.target.value)}
            className="cursor-pointer w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          >
            <option value="jpg">JPG</option>
            <option value="png">PNG</option>
            <option value="webp">WEBP</option>
          </select>
        </div>
      </div>
    </div>
  );
}
