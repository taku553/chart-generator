import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tag, CheckCircle2, Home, Info } from 'lucide-react'
import { mergeDataLabelColumns } from '@/lib/dataTransform'

export function DataLabelRangeSelector({ processedData, onLabelRangeConfirm, onSkip, onReset }) {
  const [labelStartCol, setLabelStartCol] = useState(0)
  const [labelEndCol, setLabelEndCol] = useState(0)
  const [columnName, setColumnName] = useState('データ名') // 結合後の列名
  const [editedLabels, setEditedLabels] = useState({}) // 手動編集されたラベル
  
  // 表示用の文字列state（空欄を許容するため）
  const [labelStartColInput, setLabelStartColInput] = useState('1')
  const [labelEndColInput, setLabelEndColInput] = useState('1')

  // プレビュー用のデータ名と元データのマッピング
  const previewData = useMemo(() => {
    try {
      if (!processedData || processedData.length === 0) return []
      
      const results = []
      let labelIndex = 0
      
      // 全行を処理（10行制限を削除）
      for (let rowIndex = 0; rowIndex < processedData.length; rowIndex++) {
        const row = processedData[rowIndex]
        
        // 行全体が空かチェック
        const isRowEmpty = !row || !row.some(cell => {
          const cellValue = String(cell || '').trim()
          return cellValue !== ''
        })
        
        // 完全に空の行はスキップ
        if (isRowEmpty) {
          continue
        }
        
        const labelParts = []
        
        for (let colIndex = labelStartCol; colIndex <= labelEndCol; colIndex++) {
          const cell = row?.[colIndex]
          const cellValue = String(cell || '').trim()
          
          if (cellValue !== '') {
            labelParts.push(cellValue)
          }
        }
        
        const mergedLabel = labelParts.length > 0 
          ? labelParts.join(' ') 
          : `Row ${labelIndex + 1}`
        
        // 元データの列情報を保持
        const originalCells = []
        for (let colIndex = labelStartCol; colIndex <= labelEndCol; colIndex++) {
          const cell = row?.[colIndex]
          originalCells.push(String(cell || ''))
        }
        
        results.push({
          label: mergedLabel,
          originalCells,
          originalRowIndex: rowIndex
        })
        
        labelIndex++
      }
      
      return results
    } catch (error) {
      console.error('Preview generation error:', error)
      return []
    }
  }, [processedData, labelStartCol, labelEndCol])

  // 列数の計算
  const numColumns = useMemo(() => {
    if (!processedData || processedData.length === 0) return 0
    return Math.max(...processedData.map(row => row.length))
  }, [processedData])

  // 範囲が変更されたときにeditedLabelsをリセット
  useMemo(() => {
    setEditedLabels({})
  }, [labelStartCol, labelEndCol])

  // 完全なラベルリスト（編集可能用）
  const allLabels = useMemo(() => {
    try {
      if (!processedData || processedData.length === 0) return []
      
      const labels = mergeDataLabelColumns(
        processedData,
        labelStartCol,
        labelEndCol
      )
      
      return labels
    } catch (error) {
      console.error('Label generation error:', error)
      return []
    }
  }, [processedData, labelStartCol, labelEndCol])

  // ラベルの編集ハンドラー
  const handleLabelEdit = (index, newValue) => {
    setEditedLabels(prev => ({
      ...prev,
      [index]: newValue
    }))
  }

  // 確定処理
  const handleConfirm = () => {
    const labels = mergeDataLabelColumns(
      processedData,
      labelStartCol,
      labelEndCol
    )
    
    // 編集されたラベルを適用
    const finalLabels = labels.map((label, index) => 
      editedLabels[index] !== undefined ? editedLabels[index] : label
    )
    
    onLabelRangeConfirm({
      labels: finalLabels,
      labelRange: { labelStartCol, labelEndCol },
      columnName: columnName.trim() || 'データ名' // 空の場合はデフォルト
    })
  }

  // スキップ処理（データ名の結合を行わない）
  const handleSkip = () => {
    onSkip()
  }

  // バリデーション
  const isValid = useMemo(() => {
    return (
      labelStartCol >= 0 &&
      labelEndCol >= labelStartCol &&
      labelEndCol < numColumns &&
      previewData.length > 0 &&
      columnName.trim() !== '' // 列名が空でないこと
    )
  }, [labelStartCol, labelEndCol, numColumns, previewData, columnName])

  return (
    <Card className="glass-card fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          データ名（ラベル）列の選択
        </CardTitle>
        <CardDescription>
          複数列にまたがるデータ名を結合します。データ名が1列のみの場合はスキップしてください。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 説明セクション */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm space-y-2">
              <div className="font-semibold text-blue-900 dark:text-blue-100">このステップについて</div>
              <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200">
                <li>データの各行に付けられる名前（ラベル）が複数列に分かれている場合に使用します</li>
                <li>例: C列に「個人」「2000万円未満」、D列に「その他法人」「合計」など</li>
                <li>指定された列範囲内の空でないセルが自動的に結合されます</li>
                <li>データ名が1列のみの場合は「スキップ」してください</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 範囲指定コントロール */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>データ名開始列</Label>
            <Input
              type="number"
              value={labelStartColInput}
              onChange={(e) => {
                const val = e.target.value
                setLabelStartColInput(val)
                if (val !== '' && !isNaN(Number(val))) {
                  const numVal = Math.max(1, Math.min(Number(val), numColumns))
                  setLabelStartCol(numVal - 1)
                  if (numVal - 1 > labelEndCol) {
                    setLabelEndCol(numVal - 1)
                    setLabelEndColInput(String(numVal))
                  }
                }
              }}
              onBlur={() => {
                if (labelStartColInput === '' || isNaN(Number(labelStartColInput))) {
                  setLabelStartColInput(String(labelStartCol + 1))
                }
              }}
              min={1}
              max={numColumns}
            />
            <p className="text-xs text-gray-500">列番号: 1〜{numColumns}</p>
          </div>

          <div className="space-y-2">
            <Label>データ名終了列</Label>
            <Input
              type="number"
              value={labelEndColInput}
              onChange={(e) => {
                const val = e.target.value
                setLabelEndColInput(val)
                if (val !== '' && !isNaN(Number(val))) {
                  const numVal = Math.max(labelStartCol + 1, Math.min(Number(val), numColumns))
                  setLabelEndCol(numVal - 1)
                }
              }}
              onBlur={() => {
                if (labelEndColInput === '' || isNaN(Number(labelEndColInput))) {
                  setLabelEndColInput(String(labelEndCol + 1))
                }
              }}
              min={labelStartCol + 1}
              max={numColumns}
            />
            <p className="text-xs text-gray-500">列番号: {labelStartCol + 1}〜{numColumns}</p>
          </div>

          <div className="space-y-2">
            <Label>結合後のヘッダー名</Label>
            <Input
              type="text"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              placeholder="例: データ名, 企業規模"
              className="glass-button"
            />
            <p className="text-xs text-gray-500">軸選択時に表示される名前</p>
          </div>
        </div>

        {/* 設定説明 */}
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="text-sm space-y-1">
            <div><span className="font-semibold">データ名列範囲：</span>列 {labelStartCol + 1} 〜 列 {labelEndCol + 1} （{labelEndCol - labelStartCol + 1}列）</div>
            <div><span className="font-semibold">データ行数：</span>{allLabels.length}行</div>
            {Object.keys(editedLabels).length > 0 && (
              <div className="text-blue-700 dark:text-blue-300">
                <span className="font-semibold">✏️ 手動編集：</span>
                {Object.keys(editedLabels).length}行を編集済み
              </div>
            )}
            <div className="text-xs text-purple-700 dark:text-purple-300 mt-2">
              選択した列範囲内の空でない値が自動的に結合されます
            </div>
          </div>
        </div>

        {/* プレビューエリア */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>結合後のデータ名プレビュー（全{previewData.length}行、空行は除外）</Label>
            {previewData.length > 20 && (
              <span className="text-xs text-gray-500">
                スクロールして全行を編集できます
              </span>
            )}
          </div>
          
          {previewData.length > 0 ? (
            <div className="overflow-auto max-h-96 border rounded-lg shadow-inner bg-white dark:bg-gray-800">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-purple-100 dark:bg-purple-900/40 sticky top-0 z-10">
                  <tr>
                    <th className="border border-purple-300 p-2 text-xs font-medium bg-purple-200 dark:bg-purple-800">
                      #
                    </th>
                    <th className="border border-purple-300 p-2 text-xs font-semibold text-left">
                      データ名（編集可能）
                    </th>
                    <th className="border border-purple-300 p-2 text-xs font-semibold text-left">
                      元データ（列{labelStartCol + 1}〜{labelEndCol + 1}）
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((item, index) => {
                    const currentLabel = editedLabels[index] !== undefined 
                      ? editedLabels[index] 
                      : item.label
                    const isEdited = editedLabels[index] !== undefined
                    
                    return (
                      <tr key={index} className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                        <td className="border p-2 text-xs font-medium bg-gray-100 dark:bg-gray-700">
                          {index + 1}
                        </td>
                        <td className="border p-2">
                          <Input
                            value={currentLabel}
                            onChange={(e) => handleLabelEdit(index, e.target.value)}
                            className={`text-sm font-semibold ${
                              isEdited 
                                ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                                : 'border-transparent'
                            }`}
                            placeholder="データ名を入力"
                          />
                          {isEdited && (
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                              ✏️ 編集済み（元: {item.label}）
                            </p>
                          )}
                        </td>
                        <td className="border p-2 text-xs text-gray-600 dark:text-gray-400">
                          [{item.originalCells.join('] [')}]
                        </td>
                      </tr>
                    )
                  })}
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
              <li>データ名が複数列に分散している場合、開始列と終了列を指定してください</li>
              <li>例: C列とD列にデータ名がある → 開始列:3、終了列:4</li>
              <li>各行で、指定範囲内の空でないセルが自動的に結合されます</li>
              <li>結合は半角スペースで連結されます（例: "個人" + "2000万円未満" → "個人 2000万円未満"）</li>
              <li><strong>✏️ プレビュー表のデータ名は直接編集できます</strong>（自動結合された名前を手動で調整可能）</li>
              <li>データ名が1列のみの場合は「スキップ」を押してください</li>
            </ul>
          </div>
        </div>

        {/* ボタンエリア */}
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="glass-button"
          >
            スキップ（データ名は1列のみ）
          </Button>
          
          <div className="flex items-center gap-3">
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
