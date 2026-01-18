import { useState } from 'react'
import { FileUpload } from '@/components/FileUpload.jsx'
import { ChartDisplay } from '@/components/ChartDisplay.jsx'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog.jsx'

export function Home() {
  const { t } = useLanguage()
  const [data, setData] = useState(null)
  const [chartType, setChartType] = useState('bar')
  const [savedConfiguration, setSavedConfiguration] = useState(null)
  const [isReconfiguring, setIsReconfiguring] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  const handleDataLoaded = (chartData, configuration) => {
    // 括弧モードをchartDataに追加
    if (configuration && configuration.parenthesesMode) {
      chartData.parenthesesMode = configuration.parenthesesMode
    }
    setData(chartData)
    // すべての設定内容を保存(再設定用)
    if (configuration) {
      setSavedConfiguration(configuration)
    }
    setIsReconfiguring(false)
  }

  const handleReset = () => {
    setData(null)
    setSavedConfiguration(null)
    setIsReconfiguring(false)
    setResetKey(prev => prev + 1) // FileUploadコンポーネントを強制的に再マウント
  }

  const handleResetClick = () => {
    setShowResetDialog(true)
  }

  const handleResetConfirm = () => {
    handleReset()
    setShowResetDialog(false)
  }

  const handleReconfigure = () => {
    setData(null)
    setIsReconfiguring(true)
  }

  return (
    <>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!data ? (
          <FileUpload 
            key={resetKey}
            onDataLoaded={handleDataLoaded}
            isReconfiguring={isReconfiguring}
            savedConfiguration={savedConfiguration}
            onReset={handleResetClick}
          />
        ) : (
          <ChartDisplay 
            data={data} 
            chartType={chartType} 
            setChartType={setChartType}
            onReset={handleReset}
            onReconfigure={handleReconfigure}
          />
        )}
      </main>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('home.resetDialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('home.resetDialog.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('home.resetDialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetConfirm}>
              {t('home.resetDialog.ok')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
