import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table2, CheckCircle2, Edit3, Home } from 'lucide-react'
import { mergeHeaderRows, extractHeadersAndDataRows } from '@/lib/dataTransform'
import { useLanguage } from '@/contexts/LanguageContext'

export function HeaderRangeSelector({ processedData, onHeaderRangeConfirm, onReset }) {
  const { t } = useLanguage()
  const [headerStartRow, setHeaderStartRow] = useState(0)
  const [headerEndRow, setHeaderEndRow] = useState(0)
  const [dataStartRow, setDataStartRow] = useState(1)
  
  // 表示用の文字列state（空欄を許容するため）
  const [headerStartRowInput, setHeaderStartRowInput] = useState('1')
  const [headerEndRowInput, setHeaderEndRowInput] = useState('1')
  const [dataStartRowInput, setDataStartRowInput] = useState('2')
  
  // 編集されたヘッダー名を管理
  const [editedHeaders, setEditedHeaders] = useState({})

  // プレビュー用のヘッダーとデータ
  const previewData = useMemo(() => {
    try {
      const { headers, data } = extractHeadersAndDataRows(
        processedData,
        headerStartRow,
        headerEndRow,
        dataStartRow
      )
      
      // 編集されたヘッダー名を適用
      const finalHeaders = headers.map((header, index) => 
        editedHeaders[index] !== undefined ? editedHeaders[index] : header
      )
      
      // editedHeadersを初期化（範囲が変更された時のみ）
      if (Object.keys(editedHeaders).length === 0 && headers.length > 0) {
        const initialEdits = {}
        headers.forEach((header, index) => {
          initialEdits[index] = header
        })
        setEditedHeaders(initialEdits)
      }
      
      // プレビューは最初の5行のみ
      return {
        headers: finalHeaders,
        originalHeaders: headers,
        data: data.slice(0, 5)
      }
    } catch (error) {
      console.error('Preview generation error:', error)
      return { headers: [], originalHeaders: [], data: [] }
    }
  }, [processedData, headerStartRow, headerEndRow, dataStartRow, editedHeaders])
  
  // 範囲が変更された時にeditedHeadersをリセット
  useMemo(() => {
    setEditedHeaders({})
  }, [headerStartRow, headerEndRow, dataStartRow])
  
  // ヘッダー名の編集ハンドラー
  const handleHeaderEdit = (index, newValue) => {
    setEditedHeaders(prev => ({
      ...prev,
      [index]: newValue
    }))
  }

  // 確定処理
  const handleConfirm = () => {
    const { headers, data } = extractHeadersAndDataRows(
      processedData,
      headerStartRow,
      headerEndRow,
      dataStartRow
    )
    
    // 編集されたヘッダー名を適用
    const finalHeaders = headers.map((header, index) => 
      editedHeaders[index] !== undefined ? editedHeaders[index] : header
    )
    
    // 空欄のヘッダーがあるかチェック
    const emptyHeaderCount = finalHeaders.filter(h => !h || h.trim() === '').length
    
    onHeaderRangeConfirm({
      headers: finalHeaders,
      data,
      headerRange: { headerStartRow, headerEndRow, dataStartRow },
      hasEmptyHeaders: emptyHeaderCount > 0,
      emptyHeaderCount
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
          {t('headerRange.title')}
        </CardTitle>
        <CardDescription>
          {t('headerRange.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 範囲指定コントロール */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>{t('headerRange.headerStart')}</Label>
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
            <Label>{t('headerRange.headerEnd')}</Label>
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
            <Label>{t('headerRange.dataStart')}</Label>
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
            <div>{t('headerRange.rangeInfo', { start: headerStartRow + 1, end: headerEndRow + 1, count: headerEndRow - headerStartRow + 1 })}</div>
            <div>{t('headerRange.dataInfo', { start: dataStartRow + 1 })}</div>
          </div>
        </div>

        {/* ヘッダー名編集エリア */}
        {previewData.headers.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Edit3 className="h-4 w-4 text-blue-600" />
              <Label className="text-base font-semibold">{t('headerRange.editHeaders')}</Label>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                💡 {t('headerRange.editWarning')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {previewData.headers.map((header, index) => (
                <div key={index} className="space-y-2">
                  <Label className="text-xs text-gray-600 dark:text-gray-400">
                    {t('headerRange.column', { num: index + 1 })}
                    {previewData.originalHeaders[index] !== header && (
                      <span className="ml-2 text-blue-600 dark:text-blue-400">({t('headerRange.edited')})</span>
                    )}
                  </Label>
                  <Input
                    value={header}
                    onChange={(e) => handleHeaderEdit(index, e.target.value)}
                    placeholder={`${t('headerRange.column', { num: index + 1 })}${t('headerRange.columnName')}`}
                    className="glass-button"
                  />
                  {previewData.originalHeaders[index] !== header && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('headerRange.original')}: {previewData.originalHeaders[index]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* プレビューエリア */}
        <div className="space-y-2">
          <Label>{t('headerRange.previewLabel')}</Label>
          
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
              {t('headerRange.previewNote')}
            </div>
          )}
        </div>

        {/* ヒント */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="text-sm space-y-1">
            <div className="font-semibold mb-2">💡 {t('headerRange.hintsTitle')}</div>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>{t('headerRange.hint1')}</li>
              <li>{t('headerRange.hint2')}</li>
              <li>{t('headerRange.hint3')}</li>
              <li>{t('headerRange.hint4')}</li>
            </ul>
          </div>
        </div>

        {/* 警告メッセージ */}
        {previewData.headers.some(h => !h || h.trim() === '') && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-600 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-yellow-600 text-xl">⚠️</span>
              <div className="space-y-1">
                <div className="font-semibold text-yellow-900 dark:text-yellow-100">
                  {t('headerRange.emptyWarningTitle')}
                </div>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  {t('headerRange.emptyWarningMessage')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 確定ボタン */}
        <div className="flex justify-end gap-3">
          {!isValid && (
            <div className="text-sm text-red-500 flex items-center gap-2">
              ⚠️ {t('headerRange.checkSettings')}
            </div>
          )}
          <Button
            onClick={handleConfirm}
            disabled={!isValid}
            className="glass-button"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            {t('headerRange.confirm')}
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
            {t('headerRange.returnToStart')}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}