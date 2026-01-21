import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Type, CheckCircle2, ArrowLeft, Home, Info } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export function ChartTitleSettings({ 
  defaultTitle, 
  onConfirm, 
  onBack, 
  onReset 
}) {
  const { t } = useLanguage()
  const [chartTitle, setChartTitle] = useState(defaultTitle || '')

  const handleConfirm = () => {
    // 空の場合はデフォルトタイトルを使用
    onConfirm(chartTitle.trim() || defaultTitle)
  }

  return (
    <Card className="glass-card fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="h-5 w-5" />
          {t('chartTitle.title')}
        </CardTitle>
        <CardDescription>
          {t('chartTitle.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 説明セクション */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm space-y-2">
              <div className="font-semibold text-blue-900 dark:text-blue-100">{t('chartTitle.aboutTitle')}</div>
              <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200">
                <li>{t('chartTitle.barLine')}</li>
                <li>{t('chartTitle.pie')}</li>
                <li>{t('chartTitle.emptyDefault')}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* タイトル入力 */}
        <div className="space-y-2">
          <Label htmlFor="chart-title">{t('chartTitle.label')}</Label>
          <Input
            id="chart-title"
            type="text"
            value={chartTitle}
            onChange={(e) => setChartTitle(e.target.value)}
            placeholder={t('chartTitle.placeholder', { default: defaultTitle })}
            className="glass-button text-lg"
          />
          <p className="text-xs text-gray-500">
            {t('chartTitle.default', { default: defaultTitle })}
          </p>
        </div>

        {/* プレビュー */}
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="text-sm space-y-1">
            <div className="font-semibold mb-2">{t('chartTitle.previewTitle')}</div>
            <div className="bg-white dark:bg-gray-800 rounded p-3 border border-purple-300 dark:border-purple-700">
              <div className="text-center font-medium text-gray-700 dark:text-gray-200">
                {chartTitle.trim() || defaultTitle}
              </div>
            </div>
          </div>
        </div>

        {/* ヒント */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="text-sm space-y-1">
            <div className="font-semibold mb-2">💡 {t('chartTitle.tipsTitle')}</div>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>{t('chartTitle.tip1')}</li>
              <li>{t('chartTitle.tip2')}</li>
              <li>{t('chartTitle.tip3')}</li>
            </ul>
          </div>
        </div>

        {/* ボタンエリア */}
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            className="glass-button"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('chartTitle.back')}
          </Button>
          
          <Button
            onClick={handleConfirm}
            className="glass-button"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            {t('chartTitle.confirm')}
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
            {t('chartTitle.returnToStart')}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
