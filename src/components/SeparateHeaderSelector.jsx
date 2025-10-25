import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HelpCircle, Check, X, Table2, Home } from 'lucide-react'
import { DataRangeSelector } from '@/components/DataRangeSelector'

export function SeparateHeaderSelector({ 
  rawRows, 
  dataRange,
  onHeaderRangeSelect,
  onSkip,
  onReset
}) {
  const [useSeparateHeader, setUseSeparateHeader] = useState(null)

  // 最初の質問画面
  if (useSeparateHeader === null) {
    return (
      <Card className="glass-card fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            列ヘッダーの位置を確認
          </CardTitle>
          <CardDescription>
            列ヘッダー（項目名）はデータ本体とは別の場所にありますか？
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 説明 */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              どういう時に「はい」を選ぶ？
            </h4>
            <div className="text-blue-800 dark:text-blue-200 text-sm space-y-2">
              <p>
                例：統計表で、上部に列ヘッダー（給与所得者数、給与額など）があり、
                その下に「年次別」「事業所規模別」などの複数のデータセクションが
                縦に並んでいる場合。
              </p>
              <p className="font-medium mt-2">
                特定のセクション（例：事業所規模別のみ）でグラフを作りたい場合は
                「はい」を選択してください。
              </p>
            </div>
          </div>

          {/* 選択されたデータ範囲の表示 */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold mb-2">選択したデータ本体の範囲</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              行: {dataRange.startRow + 1} 〜 {dataRange.endRow + 1}
              {' '}（{dataRange.endRow - dataRange.startRow + 1}行）
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              列: {dataRange.startCol + 1} 〜 {dataRange.endCol + 1}
              {' '}（{dataRange.endCol - dataRange.startCol + 1}列）
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
              いいえ、同じ場所にあります
            </Button>
            <Button 
              className="glass-button bg-black text-white hover:bg-gray-800 flex items-center gap-2"
              size="lg"
              onClick={() => setUseSeparateHeader(true)}
            >
              <Check className="h-4 w-4" />
              はい、別の場所にあります
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
              最初に戻る
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
                  列ヘッダー領域を選択してください
                </h4>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  項目名（給与所得者数、給与額、税額など）が記載されている行を選択します。
                  複数行にまたがる場合は、すべての行を含めて選択してください。
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
