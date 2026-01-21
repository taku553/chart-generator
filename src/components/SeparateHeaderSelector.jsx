import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HelpCircle, Check, X, Table2, Home } from 'lucide-react'
import { DataRangeSelector } from '@/components/DataRangeSelector'
import { useLanguage } from '@/contexts/LanguageContext'

export function SeparateHeaderSelector({ 
  rawRows, 
  dataRange,
  onHeaderRangeSelect,
  onSkip,
  onReset
}) {
  const { t } = useLanguage()
  const [useSeparateHeader, setUseSeparateHeader] = useState(null)

  // 最初の質問画面
  if (useSeparateHeader === null) {
    return (
      <Card className="glass-card fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            {t('separateHeader.title')}
          </CardTitle>
          <CardDescription>
            {t('separateHeader.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 説明 */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              {t('separateHeader.guideTitle')}
            </h4>
            <div className="text-blue-800 dark:text-blue-200 text-sm space-y-2">
              <p>{t('separateHeader.guideExample')}</p>
              <p className="font-medium mt-2">{t('separateHeader.guideNote')}</p>
            </div>
          </div>

          {/* 選択されたデータ範囲の表示 */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold mb-2">{t('separateHeader.selectedRange')}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('separateHeader.rows', { start: dataRange.startRow + 1, end: dataRange.endRow + 1, count: dataRange.endRow - dataRange.startRow + 1 })}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('separateHeader.cols', { start: dataRange.startCol + 1, end: dataRange.endCol + 1, count: dataRange.endCol - dataRange.startCol + 1 })}
            </p>
          </div>

          {/* ボタン */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              variant="outline"
              className="glass-button flex items-center gap-2"
              size="lg"
              onClick={() => onSkip()}
            >
              <X className="h-4 w-4" />
              {t('separateHeader.no')}
            </Button>
            <Button 
              className="glass-button bg-black text-white hover:bg-gray-800 flex items-center gap-2"
              size="lg"
              onClick={() => setUseSeparateHeader(true)}
            >
              <Check className="h-4 w-4" />
              {t('separateHeader.yes')}
            </Button>
          </div>
          
          {/* 最初に戻るボタン */}
          {onReset && (
            <Button 
              variant="outline"
              onClick={onReset}
              className="w-full glass-button"
            >
              <Home className="h-4 w-4 mr-2" />
              {t('dataRange.backToStart')}
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  // 列ヘッダー領域選択画面
  if (useSeparateHeader) {
    return (
      <div className="space-y-4">
        <Card className="glass-card bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Table2 className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                  {t('dataRange.titleHeader')}
                </h4>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  {t('dataRange.descriptionHeader')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <DataRangeSelector
          rawRows={rawRows}
          mode="header"
          onRangeSelect={onHeaderRangeSelect}
          onReset={onReset}
          initialRange={{
            startRow: 0,
            endRow: Math.min(5, rawRows.length - 1),
            startCol: dataRange.startCol,
            endCol: dataRange.endCol
          }}
        />
      </div>
    )
  }

  return null
}
