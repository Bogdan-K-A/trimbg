import {
  Check,
  Image as ImageIcon,
  Zap,
  ImageIcon as Gallery,
  DollarSign,
  Crown,
  Star,
  Infinity,
} from "lucide-react";

const features = [
  "До 25 изображений в день",
  "Только 1 формат (JPG)",
  "Стандартные настройки",
  "Стандартное качество",
];
const weeklyFeatures = [
  "До 200 изображений в день",
  "Все форматы + приоритет",
  "Стандартные настройки",
  "Высокое качество обработки",
  "Пакетная обработка",
];
const monthlyFeatures = [
  "До 500 изображений в день",
  "Все форматы + приоритет",
  "Стандартные настройки",
  "Высокое качество обработки",
  "Массовая обработка",
];

const Price = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white pt-16">
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          Выберите подходящий план
        </h1>
        <p className="text-xl text-gray-300 mb-2">
          Начните бесплатно, расширяйте возможности по мере роста потребностей
        </p>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Профессиональное удаление фона для любых задач — от личного
          использования до крупного бизнеса
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Free Plan */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-purple-800/30 p-8 relative">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Бесплатный</h3>
            <p className="text-gray-400 text-sm mb-4">Для начала работы</p>
            <div className="mb-4">
              <span className="text-4xl font-bold text-white">0$</span>
              <span className="text-gray-400 ml-2">навсегда</span>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 mb-6">
              <p className="text-sm font-semibold text-purple-300">
                25 изображений в день
              </p>
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <button className="w-full py-3 px-6 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-all duration-200 cursor-pointer">
            Начать бесплатно
          </button>
        </div>

        {/* Weekly Plan - Popular */}
        <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500/50 rounded-2xl p-8 relative transform scale-105">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
              <Crown className="w-4 h-4" />
              <span>Популярный</span>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Недельный</h3>
            <p className="text-gray-300 text-sm mb-4">
              Для активного использования
            </p>
            <div className="mb-4">
              <span className="text-4xl font-bold text-white">5$</span>
              <span className="text-gray-300 ml-2">в неделю</span>
            </div>
            <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-3 mb-6">
              <p className="text-sm font-semibold text-purple-200">
                200 изображений в день
              </p>
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            {weeklyFeatures.map((feature, index) => (
              <li key={index} className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-200 text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <button className="w-full py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 cursor-pointer">
            Выбрать план
          </button>
        </div>

        {/* Monthly Plan */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-purple-800/30 p-8 relative">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Infinity className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Месячный</h3>
            <p className="text-gray-400 text-sm mb-4">Для профессионалов</p>
            <div className="mb-4">
              <span className="text-4xl font-bold text-white">10$</span>
              <span className="text-gray-400 ml-2">в месяц</span>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 mb-6">
              <p className="text-sm font-semibold text-purple-300">
                500 изображений в день
              </p>
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            {monthlyFeatures.map((feature, index) => (
              <li key={index} className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <button className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition-all duration-200 cursor-pointer">
            Выбрать план
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-purple-800/30 p-8">
        <h3 className="text-2xl font-bold text-white mb-8 text-center">
          Часто задаваемые вопросы
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-white mb-2">
                Что происходит после превышения лимита?
              </h4>
              <p className="text-gray-400 text-sm">
                После превышения дневного лимита обработка приостанавливается до
                следующего дня или до обновления плана.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">
                Можно ли изменить план в любое время?
              </h4>
              <p className="text-gray-400 text-sm">
                Да, вы можете повысить или понизить план в любое время.
                Изменения вступают в силу немедленно.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-white mb-2">
                Сохраняются ли мои изображения на серверах?
              </h4>
              <p className="text-gray-400 text-sm">
                Нет, все изображения обрабатываются и удаляются с серверов в
                течение 24 часов для обеспечения конфиденциальности.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">
                Есть ли скидки для команд?
              </h4>
              <p className="text-gray-400 text-sm">
                Нет, мы предлагаем равные условия для всех.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Price;
