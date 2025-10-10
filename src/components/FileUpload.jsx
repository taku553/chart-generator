import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Upload, FileText, AlertCircle, CheckCircle2, Table } from 'lucide-react'
import { parseFile, extractHeadersAndData, inferHeaderRow, transformDataForChart } from '@/lib/dataUtils.js'
import { processSelectedRange } from '@/lib/dataTransform.js'
import { DataRangeSelector } from '@/components/DataRangeSelector.jsx'
import { DataOrientationSelector } from '@/components/DataOrientationSelector.jsx'

export function FileUpload({ onDataLoaded }) {
  const [file, setFile] = useState(null)
  const [rawRows, setRawRows] = useState(null)
  const [selectedRange, setSelectedRange] = useState(null) // 新規
  const [orientationConfirmed, setOrientationConfirmed] = useState(false) // 新規
  const [processedData, setProcessedData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [headerRowIndex, setHeaderRowIndex] = useState(null)
  const [xColumn, setXColumn] = useState('')
  const [yColumn, setYColumn] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [showSampleData, setShowSampleData] = useState(false)
  const [sampleData, setSampleData] = useState(null)

  // ヘッダー行が変更されたときにデータを再処理
  useEffect(() => {
    if (rawRows && headerRowIndex !== null && orientationConfirmed) {
      try {
        const { headers, data } = extractHeadersAndData(rawRows, headerRowIndex)
        setProcessedData({ headers, data, rowCount: data.length })
        if (headers.length >= 2) {
          setXColumn(headers[0])
          setYColumn(headers[1])
        } else {
          setXColumn('')
          setYColumn('')
        }
      } catch (err) {
        setError(err.message)
        setProcessedData(null)
      }
    }
  }, [rawRows, headerRowIndex, orientationConfirmed])

  // サンプルデータを読み込む
  useEffect(() => {
    const loadSampleData = async () => {
      try {
        const response = await fetch('/sample-good-data.csv')
        const text = await response.text()
        const parsed = await parseFile(new File([text], 'sample-good-data.csv', { type: 'text/csv' }))
        const inferredIndex = inferHeaderRow(parsed.rawRows)
        const { headers, data } = extractHeadersAndData(parsed.rawRows, inferredIndex)
        setSampleData({ headers, data })
      } catch (err) {
        console.error('サンプルデータの読み込みに失敗しました:', err)
      }
    }
    loadSampleData()
  }, [])

  // ドラッグ&ドロップ処理
  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0])
    }
  }, [])

  // ファイル選択処理
  const handleFileSelection = async (selectedFile) => {
    if (!selectedFile) return

    setFile(selectedFile)
    setError(null)
    setLoading(true)
    setRawRows(null)
    setSelectedRange(null)
    setOrientationConfirmed(false)
    setProcessedData(null)
    setHeaderRowIndex(null)
    setXColumn('')
    setYColumn('')

    try {
      const parsedData = await parseFile(selectedFile)
      setRawRows(parsedData.rawRows)
    } catch (err) {
      setError(err.message)
      setFile(null)
      setRawRows(null)
    } finally {
      setLoading(false)
    }
  }

  // ファイル入力変更処理
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0])
    }
  }

  // データ領域選択後の処理（新規）
  const handleRangeSelect = ({ data, range }) => {
    setSelectedRange({ data, range })
  }

  // データ向き確認後の処理（新規）
  const handleOrientationSelect = (orientation) => {
    const shouldTranspose = orientation === 'transpose'
    const processed = processSelectedRange({
      data: selectedRange.data,
      shouldTranspose
    })
    
    // 処理済みデータを設定
    setRawRows(processed)
    setOrientationConfirmed(true)
    
    // ヘッダー行を自動推定
    const inferredIndex = inferHeaderRow(processed)
    setHeaderRowIndex(inferredIndex)
  }

  // グラフ生成処理
  const handleGenerateChart = () => {
    if (!processedData || !xColumn || !yColumn) return

    try {
      const chartData = transformDataForChart(processedData, xColumn, yColumn)
      onDataLoaded(chartData)
    } catch (err) {
      setError('グラフデータの変換中にエラーが発生しました')
    }
  }

  // リセット処理
  const handleReset = () => {
    setFile(null)
    setRawRows(null)
    setSelectedRange(null)
    setOrientationConfirmed(false)
    setProcessedData(null)
    setHeaderRowIndex(null)
    setXColumn('')
    setYColumn('')
    setError(null)
    const fileInput = document.getElementById('file-input')
    if (fileInput) fileInput.value = ''
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* ファイルアップロードエリア */}
      {!file && (
        <Card className="glass-card fade-in stagger-animation float-animation">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-2">データファイルをアップロード</CardTitle>
            <CardDescription className="text-lg">
              グラフ化したいデータを含むCSVまたはExcelファイルをアップロードしてください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ripple ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 upload-area-active' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className={`mx-auto h-12 w-12 mb-4 transition-colors ${
                dragActive ? 'text-blue-500' : 'text-gray-400'
              }`} />
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  {dragActive ? 'ファイルをドロップしてください' : 'ファイルをドラッグ&ドロップ'}
                </p>
                <p className="text-gray-500">または</p>
                <Button 
                  variant="outline" 
                  className="glass-button"
                  onClick={() => document.getElementById('file-input').click()}
                  disabled={loading}
                >
                  ファイルを選択
                </Button>
                <input
                  id="file-input"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            </div>
            
            {/* ファイル形式説明 */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                対応ファイル形式
              </h3>
              <ul className="text-blue-800 dark:text-blue-200 space-y-1 text-sm">
                <li>• CSV形式またはExcel形式（.xlsx, .xls）</li>
                <li>• 複雑なレイアウトの統計表にも対応</li>
                <li>• アップロード後、データ領域を選択できます</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ファイル情報表示 */}
      {file && !selectedRange && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 slide-in-right bounce-animation">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="text-green-800 dark:text-green-200 font-medium">
                {file.name}
              </p>
              <p className="text-green-600 dark:text-green-300 text-sm">
                {rawRows?.length || 0} 行のデータ
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleReset}
              className="text-green-700 hover:text-green-800"
            >
              削除
            </Button>
          </div>
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      )}

      {/* ローディング表示 */}
      {loading && (
        <div className="text-center py-4 fade-in">
          <div className="inline-flex items-center gap-2">
            <div className="loading-spinner"></div>
            <span className="text-gray-600 dark:text-gray-300 shimmer">ファイルを処理中...</span>
          </div>
        </div>
      )}

      {/* データ領域選択（新規） */}
      {rawRows && !selectedRange && !loading && (
        <DataRangeSelector 
          rawRows={rawRows}
          onRangeSelect={handleRangeSelect}
        />
      )}

      {/* データ向き確認（新規） */}
      {selectedRange && !orientationConfirmed && (
        <DataOrientationSelector
          selectedData={selectedRange.data}
          onOrientationSelect={handleOrientationSelect}
        />
      )}

      {/* ヘッダー行選択（既存） */}
      {orientationConfirmed && rawRows && rawRows.length > 0 && (
        <Card className="glass-card fade-in stagger-animation">
          <CardHeader>
            <CardTitle>ヘッダー行の選択</CardTitle>
            <CardDescription>
              グラフの列名として使用する行を選択してください。自動推定された行が選択されています。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">ヘッダー行</label>
              <Select value={headerRowIndex !== null ? String(headerRowIndex) : ''} onValueChange={(value) => setHeaderRowIndex(Number(value))}>
                <SelectTrigger className="glass-button">
                  <SelectValue placeholder="ヘッダー行を選択" />
                </SelectTrigger>
                <SelectContent>
                  {rawRows.slice(0, Math.min(rawRows.length, 10)).map((row, index) => (
                    <SelectItem key={index} value={String(index)}>
                      行 {index + 1}: {row.join(', ').substring(0, 50)}{row.join(', ').length > 50 ? '...' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* データプレビュー */}
            {processedData && processedData.data.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">データプレビュー（最初の3行）</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        {processedData.headers.map((header) => (
                          <th key={header} className="px-3 py-2 text-left font-medium">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {processedData.data.slice(0, 3).map((row, index) => (
                        <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                          {processedData.headers.map((header) => (
                            <td key={header} className="px-3 py-2">
                              {row[header]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 列選択エリア（既存） */}
      {processedData && processedData.headers.length >= 2 && (
        <Card className="glass-card fade-in stagger-animation">
          <CardHeader>
            <CardTitle>軸の設定</CardTitle>
            <CardDescription>
              グラフの横軸（X軸）と縦軸（Y軸）に使用する列を選択してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">横軸（X軸）</label>
                <Select value={xColumn} onValueChange={setXColumn}>
                  <SelectTrigger className="glass-button">
                    <SelectValue placeholder="列を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {processedData.headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">縦軸（Y軸）</label>
                <Select value={yColumn} onValueChange={setYColumn}>
                  <SelectTrigger className="glass-button">
                    <SelectValue placeholder="列を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {processedData.headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              className="w-full glass-button" 
              onClick={handleGenerateChart}
              disabled={!xColumn || !yColumn}
            >
              グラフを生成
            </Button>
          </CardContent>
        </Card>
      )}

      {/* サンプルデータ表示エリア（既存） */}
      <Card className="glass-card fade-in stagger-animation">
        <CardHeader>
          <CardTitle>グラフ作成に最適なデータ構成の例</CardTitle>
          <CardDescription>
            どのような形式のファイルをアップロードすればスムーズにグラフが作成できるか、以下の例でご確認ください。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="glass-button w-full"
            onClick={() => setShowSampleData(!showSampleData)}
          >
            <Table className="h-4 w-4 mr-2" />
            {showSampleData ? 'サンプルデータを非表示' : 'サンプルデータを表示'}
          </Button>

          {showSampleData && sampleData && (
            <div className="mt-4 slide-in-bottom">
              <h4 className="text-sm font-medium mb-2">推奨されるデータ構成例</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      {sampleData.headers.map((header) => (
                        <th key={header} className="px-3 py-2 text-left font-medium">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sampleData.data.slice(0, 5).map((row, index) => (
                      <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                        {sampleData.headers.map((header) => (
                          <td key={header} className="px-3 py-2">
                            {row[header]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}