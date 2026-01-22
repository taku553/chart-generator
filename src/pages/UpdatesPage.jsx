import { updates } from '@/data/updates.js'
import { useLanguage } from '@/contexts/LanguageContext'

export function UpdatesPage() {
  const { t } = useLanguage()
  
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-12 gradient-text">
          {t('updates.title')}
        </h1>
        
        <div className="relative">
          {/* タイムライン縦線 */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"></div>
          
          {/* 更新情報リスト */}
          <div className="space-y-8">
            {updates.map((update) => (
              <div key={update.id} className="relative flex gap-6">
                {/* アイコン */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center shadow-lg">
                    <img 
                      src="/logo.svg" 
                      alt="Update icon" 
                      className="w-8 h-8"
                    />
                  </div>
                </div>
                
                {/* コンテンツカード */}
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                      {update.date}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {t(`updates.${update.id}.title`)}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {t(`updates.${update.id}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
