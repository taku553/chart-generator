import { useState } from 'react'
import { FileUpload } from '@/components/FileUpload.jsx'
import { ChartDisplay } from '@/components/ChartDisplay.jsx'
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
  const [data, setData] = useState(null)
  const [chartType, setChartType] = useState('bar')
  const [uploadedFileData, setUploadedFileData] = useState(null)
  const [isReconfiguring, setIsReconfiguring] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  const handleDataLoaded = (chartData, fileData) => {
    setData(chartData)
    // ファイルデータを保存(再設定用)
    if (fileData) {
      setUploadedFileData(fileData)
    }
    setIsReconfiguring(false)
  }

  const handleReset = () => {
    setData(null)
    setUploadedFileData(null)
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
            savedFileData={uploadedFileData}
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
            <AlertDialogTitle>設定を破棄しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              現在の設定をすべて破棄して最初に戻ります。この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetConfirm}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
