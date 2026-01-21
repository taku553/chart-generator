import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronDown, Table2, Home } from 'lucide-react'
import { extractDataRange } from '@/lib/dataTransform'
import { useLanguage } from '@/contexts/LanguageContext'

export function DataRangeSelector({ rawRows, onRangeSelect, mode = 'data', initialRange = null, onReset }) {
  const { t } = useLanguage()
  const [startRow, setStartRow] = useState(initialRange?.startRow ?? 0)
  const [endRow, setEndRow] = useState(initialRange?.endRow ?? Math.min(rawRows.length - 1, 19))
  const [startCol, setStartCol] = useState(initialRange?.startCol ?? 0)
  const [endCol, setEndCol] = useState(initialRange?.endCol ?? Math.min(rawRows[0]?.length - 1 || 0, 25))
  const [displayRows, setDisplayRows] = useState(20) // 表示する行数
  
  // 表示用の文字列state（空欄を許容するため）
  const [startRowInput, setStartRowInput] = useState(String((initialRange?.startRow ?? 0) + 1))
  const [endRowInput, setEndRowInput] = useState(String((initialRange?.endRow ?? Math.min(rawRows.length - 1, 19)) + 1))
  const [startColInput, setStartColInput] = useState(String((initialRange?.startCol ?? 0) + 1))
  const [endColInput, setEndColInput] = useState(String((initialRange?.endCol ?? Math.min(rawRows[0]?.length - 1 || 0, 25)) + 1))

  // 表示用のデータ
  const visibleRows = useMemo(() => {
    return rawRows.slice(0, displayRows)
  }, [rawRows, displayRows])

  // さらに表示ボタン
  const handleShowMore = () => {
    setDisplayRows(prev => Math.min(prev + 50, rawRows.length))
  }

  // 列名を生成（A, B, C, ...）
  const getColumnLabel = (index) => {
    let label = ''
    let num = index
    while (num >= 0) {
      label = String.fromCharCode(65 + (num % 26)) + label
      num = Math.floor(num / 26) - 1
    }
    return label
  }

  // 範囲確定
  const handleConfirm = () => {
    const selectedData = extractDataRange(rawRows, {
      startRow,
      endRow,
      startCol,
      endCol
    })
    
    onRangeSelect({
      data: selectedData,
      range: { startRow, endRow, startCol, endCol }
    })
  }

  // セルが選択範囲内かどうか
  const isCellInRange = (rowIndex, colIndex) => {
    return rowIndex >= startRow && 
           rowIndex <= endRow && 
           colIndex >= startCol && 
           colIndex <= endCol
  }

  return (
    <Card className="glass-card fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Table2 className="h-5 w-5" />
          {mode === 'header' ? t('dataRange.titleHeader') : t('dataRange.titleData')}
        </CardTitle>
        <CardDescription>
          {mode === 'header' 
            ? t('dataRange.descriptionHeader')
            : t('dataRange.descriptionData')
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 範囲指定コントロール */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>{t('dataRange.startRow')}</Label>
            <Input
              type="number"
              value={startRowInput}
              onChange={(e) => {
                const val = e.target.value
                setStartRowInput(val)
                if (val !== '' && !isNaN(Number(val))) {
                  setStartRow(Math.max(0, Math.min(Number(val) - 1, rawRows.length - 1)))
                }
              }}
              onBlur={() => {
                if (startRowInput === '' || isNaN(Number(startRowInput))) {
                  setStartRowInput(String(startRow + 1))
                }
              }}
              min={1}
              max={rawRows.length}
            />
          </div>
          <div className="space-y-2">
            <Label>{t('dataRange.endRow')}</Label>
            <Input
              type="number"
              value={endRowInput}
              onChange={(e) => {
                const val = e.target.value
                setEndRowInput(val)
                if (val !== '' && !isNaN(Number(val))) {
                  setEndRow(Math.max(startRow, Math.min(Number(val) - 1, rawRows.length - 1)))
                }
              }}
              onBlur={() => {
                if (endRowInput === '' || isNaN(Number(endRowInput))) {
                  setEndRowInput(String(endRow + 1))
                }
              }}
              min={startRow + 1}
              max={rawRows.length}
            />
          </div>
          <div className="space-y-2">
            <Label>{t('dataRange.startCol')}</Label>
            <Input
              type="number"
              value={startColInput}
              onChange={(e) => {
                const val = e.target.value
                setStartColInput(val)
                if (val !== '' && !isNaN(Number(val))) {
                  setStartCol(Math.max(0, Math.min(Number(val) - 1, rawRows[0]?.length - 1 || 0)))
                }
              }}
              onBlur={() => {
                if (startColInput === '' || isNaN(Number(startColInput))) {
                  setStartColInput(String(startCol + 1))
                }
              }}
              min={1}
              max={rawRows[0]?.length || 1}
            />
          </div>
          <div className="space-y-2">
            <Label>{t('dataRange.endCol')}</Label>
            <Input
              type="number"
              value={endColInput}
              onChange={(e) => {
                const val = e.target.value
                setEndColInput(val)
                if (val !== '' && !isNaN(Number(val))) {
                  setEndCol(Math.max(startCol, Math.min(Number(val) - 1, rawRows[0]?.length - 1 || 0)))
                }
              }}
              onBlur={() => {
                if (endColInput === '' || isNaN(Number(endColInput))) {
                  setEndColInput(String(endCol + 1))
                }
              }}
              min={startCol + 1}
              max={rawRows[0]?.length || 1}
            />
          </div>
        </div>

        {/* 選択範囲の情報 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="text-sm">
            <span className="font-semibold">{t('dataRange.rangeInfo')}</span>
            {` ${getColumnLabel(startCol)}${startRow + 1}:${getColumnLabel(endCol)}${endRow + 1}`}
            {` ${t('dataRange.rowCol', { rows: endRow - startRow + 1, cols: endCol - startCol + 1 })}`}
          </div>
        </div>

        {/* プレビューテーブル */}
        <div className="space-y-2">
          <Label>{t('dataRange.preview')}</Label>
          <div className="overflow-auto max-h-96 border rounded-lg shadow-inner">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                <tr>
                  <th className="border p-2 text-xs font-medium bg-gray-200 dark:bg-gray-700">
                    {t('dataRange.row')}
                  </th>
                  {visibleRows[0]?.map((_, colIndex) => (
                    <th 
                      key={colIndex} 
                      className={`
                        border p-2 text-xs font-medium
                        ${colIndex >= startCol && colIndex <= endCol
                          ? 'bg-blue-100 dark:bg-blue-900/40 border-blue-400'
                          : 'bg-gray-200 dark:bg-gray-700'}
                      `}
                    >
                      {getColumnLabel(colIndex)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td 
                      className={`
                        border p-2 text-xs font-medium bg-gray-100 dark:bg-gray-800 sticky left-0
                        ${rowIndex >= startRow && rowIndex <= endRow
                          ? 'bg-blue-100 dark:bg-blue-900/40 border-blue-400'
                          : ''}
                      `}
                    >
                      {rowIndex + 1}
                    </td>
                    {row.map((cell, colIndex) => (
                      <td
                        key={colIndex}
                        className={`
                          border p-2 whitespace-nowrap text-xs
                          ${isCellInRange(rowIndex, colIndex)
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 font-semibold'
                            : 'border-gray-200 dark:border-gray-700'}
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

          {/* さらに表示ボタン */}
          {displayRows < rawRows.length && (
            <Button 
              variant="outline" 
              className="w-full mt-2"
              onClick={handleShowMore}
            >
              <ChevronDown className="h-4 w-4 mr-2" />
              {t('dataRange.showMore', { count: rawRows.length - displayRows })}
            </Button>
          )}
        </div>

        {/* 確定ボタン */}
        <Button 
          onClick={handleConfirm} 
          className="w-full glass-button text-black dark:text-white"
          size="lg"
        >
          {mode === 'header' ? t('dataRange.confirmHeader') : t('dataRange.confirmData')}
        </Button>
        
        {/* 最初に戻るボタン */}
        {onReset && (
          <Button 
            variant="outline"
            onClick={onReset}
            className="w-full glass-button mt-2"
          >
            <Home className="h-4 w-4 mr-2" />
            {t('dataRange.backToStart')}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}