import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowDown, RotateCw, Home } from 'lucide-react'
import { transposeData } from '@/lib/dataTransform'
import { useLanguage } from '@/contexts/LanguageContext'

export function DataOrientationSelector({ selectedData, onOrientationSelect, onReset }) {
  const { t } = useLanguage()
  const [showTransposed, setShowTransposed] = useState(false)
  
  // 転置データ
  const transposedData = transposeData(selectedData)
  
  // プレビュー用（最初の5行のみ）
  const previewOriginal = selectedData.slice(0, 5)
  const previewTransposed = transposedData.slice(0, 5)
  
  const displayData = showTransposed ? previewTransposed : previewOriginal

  return (
    <Card className="glass-card fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RotateCw className="h-5 w-5" />
          {t('orientation.title')}
        </CardTitle>
        <CardDescription>
          {t('orientation.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* プレビュー切り替えボタン */}
        <div className="flex gap-2">
          <Button
            variant={!showTransposed ? "default" : "outline"}
            size="sm"
            onClick={() => setShowTransposed(false)}
          >
            <ArrowDown className="h-4 w-4 mr-2" />
            {t('orientation.original')}
          </Button>
          <Button
            variant={showTransposed ? "default" : "outline"}
            size="sm"
            onClick={() => setShowTransposed(true)}
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            {t('orientation.transposed')}
          </Button>
        </div>

        {/* データプレビュー */}
        <div className="space-y-2">
          <div className="text-sm font-medium">
            {showTransposed ? t('orientation.previewTransposed') : t('orientation.previewOriginal')}
          </div>
          <div className="overflow-auto border rounded-lg shadow-inner bg-white dark:bg-gray-950 p-2">
            <table className="w-full text-sm border-collapse">
              <tbody>
                {displayData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <td 
                        key={colIndex} 
                        className={`
                          border p-2 whitespace-nowrap text-xs
                          ${rowIndex === 0 
                            ? 'bg-gray-100 dark:bg-gray-800 font-semibold' 
                            : ''}
                        `}
                      >
                        {cell !== null && cell !== undefined ? String(cell) : ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground">
            {t('orientation.previewNotice')}
          </p>
        </div>

        {/* ヘルプメッセージ */}
        <div className="bg-gray-50 dark:bg-gray-900 border rounded-lg p-4 space-y-2">
          <h4 className="text-sm font-semibold">{t('orientation.selectionHintsTitle')}</h4>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>{t('orientation.hintOriginal')}</li>
            <li>{t('orientation.hintTransposed')}</li>
          </ul>
        </div>

        {/* 選択ボタン */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-auto py-6 flex-col gap-3 glass-button"
            onClick={() => onOrientationSelect('keep')}
          >
            <ArrowDown className="h-8 w-8" />
            <div className="text-center">
              <div className="font-semibold">{t('orientation.confirmOriginal')}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {t('orientation.infoOriginal')}
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-6 flex-col gap-3 glass-button"
            onClick={() => onOrientationSelect('transpose')}
          >
            <ArrowRight className="h-8 w-8" />
            <div className="text-center">
              <div className="font-semibold">{t('orientation.confirmTransposed')}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {t('orientation.infoTransposed')}
              </div>
            </div>
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