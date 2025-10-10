import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowDown, RotateCw } from 'lucide-react'
import { transposeData } from '@/lib/dataTransform'

export function DataOrientationSelector({ selectedData, onOrientationSelect }) {
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
          データの向きを確認
        </CardTitle>
        <CardDescription>
          カテゴリ（項目名）が横方向と縦方向のどちらに並んでいるか確認してください。
          必要に応じてデータを転置（行列を入れ替え）できます。
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
            元の向き
          </Button>
          <Button
            variant={showTransposed ? "default" : "outline"}
            size="sm"
            onClick={() => setShowTransposed(true)}
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            転置後
          </Button>
        </div>

        {/* データプレビュー */}
        <div className="space-y-2">
          <div className="text-sm font-medium">
            {showTransposed ? '転置後のプレビュー' : '元データのプレビュー'}
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
            ※ 最初の5行のみ表示しています
          </p>
        </div>

        {/* ヘルプメッセージ */}
        <div className="bg-gray-50 dark:bg-gray-900 border rounded-lg p-4 space-y-2">
          <h4 className="text-sm font-semibold">💡 選び方のヒント</h4>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>
              <strong>元の向き：</strong>1行目が項目名（年度、月など）、2行目以降がデータの場合
            </li>
            <li>
              <strong>転置後：</strong>1列目が項目名、2列目以降がデータの場合
            </li>
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
              <div className="font-semibold">元の向きで使用</div>
              <div className="text-xs text-muted-foreground mt-1">
                カテゴリ：横方向
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
              <div className="font-semibold">転置して使用</div>
              <div className="text-xs text-muted-foreground mt-1">
                カテゴリ：縦方向
              </div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}