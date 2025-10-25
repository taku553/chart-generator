import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { ArrowLeft, FileSpreadsheet, CheckCircle2 } from 'lucide-react'

export function SheetSelector({ sheetNames, onSheetSelect, onBack }) {
  const [selectedSheet, setSelectedSheet] = useState(sheetNames[0])

  const handleConfirm = () => {
    if (selectedSheet) {
      onSheetSelect(selectedSheet)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-start">
        <Button 
          variant="outline" 
          className="glass-button"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          前に戻る
        </Button>
      </div>

      <Card className="glass-card fade-in stagger-animation">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            シートの選択
          </CardTitle>
          <CardDescription>
            このファイルには複数のシートが含まれています。グラフ化したいデータが含まれているシートを選択してください。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* シート一覧 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">利用可能なシート（{sheetNames.length}個）</label>
            <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
              {sheetNames.map((sheetName, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSheet(sheetName)}
                  className={`
                    relative p-4 rounded-lg border-2 text-left transition-all duration-200
                    ${selectedSheet === sheetName 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`
                        flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold
                        ${selectedSheet === sheetName
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }
                      `}>
                        {index + 1}
                      </div>
                      <div>
                        <p className={`font-medium ${
                          selectedSheet === sheetName 
                            ? 'text-blue-900 dark:text-blue-100' 
                            : 'text-gray-900 dark:text-gray-100'
                        }`}>
                          {sheetName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          シート {index + 1}
                        </p>
                      </div>
                    </div>
                    {selectedSheet === sheetName && (
                      <CheckCircle2 className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 選択中のシート表示 */}
          {selectedSheet && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <span className="font-semibold">選択中:</span> {selectedSheet}
              </p>
            </div>
          )}

          {/* 確定ボタン */}
          <Button 
            className="w-full glass-button" 
            onClick={handleConfirm}
            disabled={!selectedSheet}
          >
            このシートを使用してグラフを作成
          </Button>

          {/* ヒント */}
          <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-semibold">💡 ヒント:</span> 統計データが含まれているシートを選択してください。概要や説明のみのシートは避けてください。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
