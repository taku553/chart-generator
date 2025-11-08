import { useState } from 'react'
import { FileUpload } from '@/components/FileUpload.jsx'
import { ChartDisplay } from '@/components/ChartDisplay.jsx'
import { SocialLinks } from '@/components/SocialLinks.jsx'
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
import './App.css'

function App() {
  const [data, setData] = useState(null)
  const [chartType, setChartType] = useState('bar')
  const [uploadedFileData, setUploadedFileData] = useState(null)
  const [isReconfiguring, setIsReconfiguring] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  const handleDataLoaded = (chartData, fileData) => {
    setData(chartData)
    // ファイルデータを保存（再設定用）
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 
            className="text-3xl font-bold gradient-text cursor-pointer hover:opacity-80 transition-opacity"
            onClick={data ? handleResetClick : handleReset}
          >
            Chart Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            統計データから美しいグラフを生成
          </p>
        </div>
      </header>

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

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6">
          <SocialLinks />
          <p className="text-center text-gray-600 dark:text-gray-300">
            &copy; 2025 Chart Generator. All rights reserved.
          </p>
        </div>
      </footer>

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
    </div>
  )
}



export default App
