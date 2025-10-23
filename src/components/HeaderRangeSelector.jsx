import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table2, CheckCircle2 } from 'lucide-react'
import { mergeHeaderRows, extractHeadersAndDataRows } from '@/lib/dataTransform'

export function HeaderRangeSelector({ processedData, onHeaderRangeConfirm }) {
  const [headerStartRow, setHeaderStartRow] = useState(0)
  const [headerEndRow, setHeaderEndRow] = useState(0)
  const [dataStartRow, setDataStartRow] = useState(1)
  
  // 表示用の文字列state（空欄を許容するため）
  const [headerStartRowInput, setHeaderStartRowInput] = useState('1')
  const [headerEndRowInput, setHeaderEndRowInput] = useState('1')
  const [dataStartRowInput, setDataStartRowInput] = useState('2')

  // プレビュー用のヘッダーとデータ
  const previewData = useMemo(() => {
    try {
      const { headers, data } = extractHeadersAndDataRows(
        processedData,
        headerStartRow,
        headerEndRow,
        dataStartRow
      )
      
      // プレビューは最初の5行のみ
      return {
        headers,
        data: data.slice(0, 5)
      }
    } catch (error) {
      console.error('Preview generation error:', error)
      return { headers: [], data: [] }
    }
  }, [processedData, headerStartRow, headerEndRow, dataStartRow])

  // 確定処理
  const handleConfirm = () => {
    const { headers, data } = extractHeadersAndDataRows(
      processedData,
      headerStartRow,
      headerEndRow,
      dataStartRow
    )
    
    onHeaderRangeConfirm({
      headers,
      data,
      headerRange: { headerStartRow, headerEndRow, dataStartRow }
    })
  }

  // バリデーション
  const isValid = useMemo(() => {
    return (
      headerStartRow >= 0 &&
      headerEndRow >= headerStartRow &&
      headerEndRow < processedData.length &&
      dataStartRow > headerEndRow &&
      dataStartRow < processedData.length &&
      previewData.headers.length > 0 &&
      previewData.data.length > 0
    )
  }, [headerStartRow, headerEndRow, dataStartRow, processedData, previewData])

  return (
    <Card className="glass-card fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Table2 className="h-5 w-5" />
          ヘッダー領域の選択
        </CardTitle>
        <CardDescription>
          複数行にわたるヘッダーを指定できます。各列のヘッダーは自動的に結合されます。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 範囲指定コントロール */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>ヘッダー開始行</Label>
            <Input
              type="number"
              value={headerStartRowInput}
              onChange={(e) => {
                const val = e.target.value;
                setHeaderStartRowInput(val);
                if (val !== '' && !isNaN(Number(val))) {
                  const numVal = Math.max(1, Math.min(Number(val), processedData.length));
                  setHeaderStartRow(numVal - 1);
                  if (numVal - 1 > headerEndRow) {
                    setHeaderEndRow(numVal - 1);
                    setHeaderEndRowInput(String(numVal));
                  }
                  if (dataStartRow <= numVal - 1) {
                    setDataStartRow(numVal);
                    setDataStartRowInput(String(numVal + 1));
                  }
                }
              }}
              onBlur={() => {
                if (headerStartRowInput === '' || isNaN(Number(headerStartRowInput))) {
                  setHeaderStartRowInput(String(headerStartRow + 1));
                }
              }}
              min={1}
              max={processedData.length}
            />
          </div>

          <div className="space-y-2">
            <Label>ヘッダー終了行</Label>
            <Input
              type="number"
              value={headerEndRowInput}
              onChange={(e) => {
                const val = e.target.value;
                setHeaderEndRowInput(val);
                if (val !== '' && !isNaN(Number(val))) {
                  const numVal = Math.max(headerStartRow + 1, Math.min(Number(val), processedData.length));
                  setHeaderEndRow(numVal - 1);
                  if (dataStartRow <= numVal - 1) {
                    setDataStartRow(numVal);
                    setDataStartRowInput(String(numVal + 1));
                  }
                }
              }}
              onBlur={() => {
                if (headerEndRowInput === '' || isNaN(Number(headerEndRowInput))) {
                  setHeaderEndRowInput(String(headerEndRow + 1));
                }
              }}
              min={headerStartRow + 1}
              max={processedData.length}
            />
          </div>

          <div className="space-y-2">
            <Label>データ開始行</Label>
            <Input
              type="number"
              value={dataStartRowInput}
              onChange={(e) => {
                const val = e.target.value;
                setDataStartRowInput(val);
                if (val !== '' && !isNaN(Number(val))) {
                  const numVal = Math.max(headerEndRow + 2, Math.min(Number(val), processedData.length));
                  setDataStartRow(numVal - 1);
                }
              }}
              onBlur={() => {
                if (dataStartRowInput === '' || isNaN(Number(dataStartRowInput))) {
                  setDataStartRowInput(String(dataStartRow + 1));
                }
              }}
              min={headerEndRow + 2}
              max={processedData.length}
            />
          </div>
        </div>

        {/* 設定説明 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="text-sm space-y-1">
            <div><span className="font-semibold">ヘッダー領域：</span>行 {headerStartRow + 1} 〜 行 {headerEndRow + 1} （{headerEndRow - headerStartRow + 1}行）</div>
            <div><span className="font-semibold">データ領域：</span>行 {dataStartRow + 1} 以降</div>
          </div>
        </div>

        {/* プレビューエリア */}
        <div className="space-y-2">
          <Label>プレビュー（最初の5行）</Label>
          
          {previewData.headers.length > 0 ? (
            <div className="overflow-auto max-h-96 border rounded-lg shadow-inner">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-blue-100 dark:bg-blue-900/40 sticky top-0 z-10">
                  <tr>
                    <th className="border border-blue-300 p-2 text-xs font-medium bg-blue-200 dark:bg-blue-800">
                      #
                    </th>
                    {previewData.headers.map((header, index) => (
                      <th 
                        key={index}
                        className="border border-blue-300 p-2 text-xs font-semibold"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="border p-2 text-xs font-medium bg-gray-100 dark:bg-gray-800">
                        {rowIndex + 1}
                      </td>
                      {row.map((cell, colIndex) => (
                        <td 
                          key={colIndex}
                          className="border p-2 whitespace-nowrap text-xs"
                        >
                          {cell !== null && cell !== undefined ? String(cell) : ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="border rounded-lg p-8 text-center text-gray-500">
              設定を調整してプレビューを表示してください
            </div>
          )}
        </div>

        {/* ヒント */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="text-sm space-y-1">
            <div className="font-semibold mb-2">💡 使い方のヒント</div>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>ヘッダーが複数行にまたがる場合、開始行と終了行を指定してください</li>
              <li>各列のヘッダーは、指定範囲内の空でないセルが自動的に結合されます</li>
              <li>データ開始行は、ヘッダー終了行の次の行以降を指定してください</li>
              <li>例: 行1に「年次」、行3に「出生数」→ ヘッダー開始:0、終了:2、データ開始:3</li>
            </ul>
          </div>
        </div>

        {/* 確定ボタン */}
        <div className="flex justify-end gap-3">
          {!isValid && (
            <div className="text-sm text-red-500 flex items-center gap-2">
              ⚠️ 設定を確認してください
            </div>
          )}
          <Button
            onClick={handleConfirm}
            disabled={!isValid}
            className="glass-button"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            この設定で確定
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}