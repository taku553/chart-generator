import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Upload, FileText, AlertCircle, CheckCircle2, Table, ArrowLeft, Home } from 'lucide-react'
import { parseFile, transformDataForChart } from '@/lib/dataUtils.js'
import { processSelectedRange, combineHeaderAndDataRanges } from '@/lib/dataTransform.js'
import { DataRangeSelector } from '@/components/DataRangeSelector.jsx'
import { DataOrientationSelector } from '@/components/DataOrientationSelector.jsx'
import { HeaderRangeSelector } from '@/components/HeaderRangeSelector.jsx'
import { UnitSettings } from '@/components/UnitSettings.jsx'
import { SeparateHeaderSelector } from '@/components/SeparateHeaderSelector.jsx'
import { SheetSelector } from '@/components/SheetSelector.jsx'

export function FileUpload({ onDataLoaded, isReconfiguring = false, savedFileData = null, onReset }) {
  const [file, setFile] = useState(null)
  const [sheetNames, setSheetNames] = useState(null)
  const [selectedSheet, setSelectedSheet] = useState(null)
  const [sheetSelectionConfirmed, setSheetSelectionConfirmed] = useState(false)
  const [rawRows, setRawRows] = useState(null)
  const [selectedRange, setSelectedRange] = useState(null)
  const [separateHeaderConfirmed, setSeparateHeaderConfirmed] = useState(false)
  const [headerRange, setHeaderRange] = useState(null)
  const [orientationConfirmed, setOrientationConfirmed] = useState(false)
  const [processedDataForHeader, setProcessedDataForHeader] = useState(null)
  const [headerRangeConfirmed, setHeaderRangeConfirmed] = useState(false)
  const [processedData, setProcessedData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [xColumn, setXColumn] = useState('')
  const [yColumn, setYColumn] = useState('')
  const [axisSelected, setAxisSelected] = useState(false)
  const [unitSettings, setUnitSettings] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [showSampleData, setShowSampleData] = useState(false)
  const [sampleData, setSampleData] = useState(null)

  // サンプルデータを読み込む
  useEffect(() => {
    const loadSampleData = async () => {
      try {
        const response = await fetch('/sample-good-data.csv')
        const text = await response.text()
        const parsed = await parseFile(new File([text], 'sample-good-data.csv', { type: 'text/csv' }))
        // サンプルデータは標準形式なので、1行目をヘッダーとして使用
        const headers = parsed.rawRows[0].map(h => String(h || '').trim())
        const data = parsed.rawRows.slice(1).map(row => {
          const rowData = {}
          headers.forEach((header, index) => {
            rowData[header] = row[index] || ''
          })
          return rowData
        })
        setSampleData({ headers, data })
      } catch (err) {
        console.error('サンプルデータの読み込みに失敗しました:', err)
      }
    }
    loadSampleData()
  }, [])

  // 再設定モードの処理
  useEffect(() => {
    if (isReconfiguring && savedFileData) {
      setFile(savedFileData.file)
      setRawRows(savedFileData.rawRows)
      setSheetNames(savedFileData.sheetNames)
      setSelectedSheet(savedFileData.selectedSheet)
      // シート選択は完了済みとしてマーク
      if (!savedFileData.sheetNames || savedFileData.sheetNames.length <= 1) {
        setSheetSelectionConfirmed(true)
      }
      setError(null)
      setLoading(false)
    }
  }, [isReconfiguring, savedFileData])

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
    setSheetNames(null)
    setSelectedSheet(null)
    setSheetSelectionConfirmed(false)
    setRawRows(null)
    setSelectedRange(null)
    setSeparateHeaderConfirmed(false)
    setHeaderRange(null)
    setOrientationConfirmed(false)
    setProcessedDataForHeader(null)
    setHeaderRangeConfirmed(false)
    setProcessedData(null)
    setXColumn('')
    setYColumn('')

    try {
      const parsedData = await parseFile(selectedFile)
      
      // シート情報を確認
      if (parsedData.sheetNames && parsedData.sheetNames.length > 1) {
        // 複数シートがある場合
        setSheetNames(parsedData.sheetNames)
        setSelectedSheet(parsedData.selectedSheet)
        setSheetSelectionConfirmed(false) // シート選択UIを表示
      } else {
        // シートが1つまたはCSVの場合
        setSheetNames(parsedData.sheetNames)
        setSelectedSheet(parsedData.selectedSheet || null)
        setSheetSelectionConfirmed(true) // シート選択をスキップ
        setRawRows(parsedData.rawRows)
      }
    } catch (err) {
      setError(err.message)
      setFile(null)
      setSheetNames(null)
      setSelectedSheet(null)
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

  // シート選択処理
  const handleSheetSelect = async (sheetName) => {
    setLoading(true)
    setError(null)
    
    try {
      // 選択されたシートのデータを読み込む
      const parsedData = await parseFile(file, sheetName)
      setSelectedSheet(sheetName)
      setRawRows(parsedData.rawRows)
      setSheetSelectionConfirmed(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // シート選択に戻る
  const handleBackToSheetSelection = () => {
    setSheetSelectionConfirmed(false)
    setRawRows(null)
    setSelectedRange(null)
  }

  // データ領域選択後の処理
  const handleRangeSelect = ({ data, range }) => {
    setSelectedRange({ data, range })
  }

  // 別領域ヘッダー選択後の処理
  const handleHeaderRangeSelect = ({ data, range }) => {
    setHeaderRange(range)
    setSeparateHeaderConfirmed(true)
    
    // ヘッダーとデータを結合
    const combinedData = combineHeaderAndDataRanges(rawRows, range, selectedRange.range)
    setProcessedDataForHeader(combinedData)
    setOrientationConfirmed(true) // 向き確認はスキップして次へ
  }

  // 別領域ヘッダーをスキップ
  const handleSkipSeparateHeader = () => {
    setSeparateHeaderConfirmed(true)
    setHeaderRange(null)
    // 通常のフローに進む（向き確認へ）
  }

  // データ向き確認後の処理
  const handleOrientationSelect = (orientation) => {
    const shouldTranspose = orientation === 'transpose'
    const processed = processSelectedRange({
      data: selectedRange.data,
      shouldTranspose
    })
    
    // 処理済みデータをヘッダー選択用に設定
    setProcessedDataForHeader(processed)
    setOrientationConfirmed(true)
  }

  // ヘッダー領域確定後の処理（NEW）
  const handleHeaderRangeConfirm = ({ headers, data, headerRange }) => {
    console.log('====================')
    console.log('=== Header Range Confirm ===')
    console.log('====================')
    console.log('Headers:', headers)
    console.log('Number of headers:', headers.length)
    console.log('Data rows count:', data.length)
    console.log('Data (first 3 rows - raw array):')
    data.slice(0, 3).forEach((row, i) => {
      console.log(`  Row ${i}:`, row)
      console.log(`  Row ${i} length:`, row.length)
    })
    
    // ヘッダーとデータを設定
    // 各行の長さをヘッダーの長さに合わせる
    const formattedData = data.map((row, rowIndex) => {
      const rowData = {}
      
      // 行の長さをヘッダーの長さに合わせて処理
      headers.forEach((header, colIndex) => {
        // row[colIndex]が存在する場合はその値、なければ空文字
        const value = colIndex < row.length ? row[colIndex] : ''
        rowData[header] = value !== null && value !== undefined ? value : ''
      })
      
      if (rowIndex < 3) {
        console.log(`Converted Row ${rowIndex} to object:`)
        console.log(`  Keys:`, Object.keys(rowData))
        console.log(`  Values:`, Object.values(rowData))
        console.log(`  Full object:`, rowData)
      }
      
      return rowData
    })
    
    console.log('---')
    console.log('Formatted data (first 3 rows):')
    formattedData.slice(0, 3).forEach((row, i) => {
      console.log(`  Row ${i}:`, row)
    })
    console.log('====================')
    
    setProcessedData({ 
      headers, 
      data: formattedData,
      rowCount: formattedData.length 
    })
    
    setHeaderRangeConfirmed(true)
    
    // デフォルトでX軸とY軸を設定
    if (headers.length >= 2) {
      console.log('Setting default columns:')
      console.log('  X-axis:', headers[0])
      console.log('  Y-axis:', headers[headers.length - 1]) // 最後の列をY軸に
      setXColumn(headers[0])
      setYColumn(headers[headers.length - 1])
    }
  }

  // 軸選択確定処理
  const handleAxisSelect = () => {
    if (!xColumn || !yColumn) return
    setAxisSelected(true)
  }

  // 単位設定確定後の処理
  const handleUnitConfirm = (units) => {
    setUnitSettings(units)
    handleGenerateChart(units)
  }

  // グラフ生成処理
  const handleGenerateChart = (units = unitSettings) => {
    if (!processedData || !xColumn || !yColumn) return

    try {
      const chartData = transformDataForChart(processedData, xColumn, yColumn)
      
      // 単位設定を追加
      chartData.unitSettings = units
      
      // ファイルデータを保存して親に渡す（シート情報も含める）
      const fileData = {
        file: file,
        rawRows: rawRows,
        sheetNames: sheetNames,
        selectedSheet: selectedSheet
      }
      
      onDataLoaded(chartData, fileData)
    } catch (err) {
      setError('グラフデータの変換中にエラーが発生しました')
    }
  }

  // リセット処理
  const handleReset = () => {
    setFile(null)
    setSheetNames(null)
    setSelectedSheet(null)
    setSheetSelectionConfirmed(false)
    setRawRows(null)
    setSelectedRange(null)
    setSeparateHeaderConfirmed(false)
    setHeaderRange(null)
    setOrientationConfirmed(false)
    setProcessedDataForHeader(null)
    setHeaderRangeConfirmed(false)
    setProcessedData(null)
    setXColumn('')
    setYColumn('')
    setAxisSelected(false)
    setUnitSettings(null)
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
      {file && !sheetSelectionConfirmed && !selectedRange && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 slide-in-right bounce-animation">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="text-green-800 dark:text-green-200 font-medium">
                {file.name}
              </p>
              {sheetNames && sheetNames.length > 1 && (
                <p className="text-green-600 dark:text-green-300 text-sm">
                  {sheetNames.length} 個のシートが見つかりました
                </p>
              )}
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

      {/* シート選択エリア（複数シートの場合のみ） */}
      {file && sheetNames && sheetNames.length > 1 && !sheetSelectionConfirmed && (
        <SheetSelector
          sheetNames={sheetNames}
          onSheetSelect={handleSheetSelect}
          onBack={handleReset}
        />
      )}

      {/* ファイル情報表示（シート選択後、データ範囲選択前） */}
      {file && sheetSelectionConfirmed && !selectedRange && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 slide-in-right bounce-animation">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="text-green-800 dark:text-green-200 font-medium">
                {file.name}
              </p>
              <p className="text-green-600 dark:text-green-300 text-sm">
                {selectedSheet ? `シート: ${selectedSheet} - ` : ''}{rawRows?.length || 0} 行のデータ
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

      {/* データ領域選択 */}
      {rawRows && sheetSelectionConfirmed && !selectedRange && !loading && (
        <DataRangeSelector 
          rawRows={rawRows}
          onRangeSelect={handleRangeSelect}
          onReset={sheetNames && sheetNames.length > 1 ? handleBackToSheetSelection : onReset}
        />
      )}

      {/* 列ヘッダー位置確認 */}
      {selectedRange && !separateHeaderConfirmed && (
        <div className="space-y-4">
          <div className="flex justify-start">
            <Button 
              variant="outline" 
              className="glass-button"
              onClick={() => setSelectedRange(null)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              前に戻る
            </Button>
          </div>
          <SeparateHeaderSelector
            rawRows={rawRows}
            dataRange={selectedRange.range}
            onHeaderRangeSelect={handleHeaderRangeSelect}
            onSkip={handleSkipSeparateHeader}
            onReset={onReset}
          />
        </div>
      )}

      {/* データ向き確認 */}
      {selectedRange && separateHeaderConfirmed && !headerRange && !orientationConfirmed && (
        <div className="space-y-4">
          <div className="flex justify-start">
            <Button 
              variant="outline" 
              className="glass-button"
              onClick={() => setSeparateHeaderConfirmed(false)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              前に戻る
            </Button>
          </div>
          <DataOrientationSelector
            selectedData={selectedRange.data}
            onOrientationSelect={handleOrientationSelect}
            onReset={onReset}
          />
        </div>
      )}

      {/* ヘッダー領域選択（NEW） */}
      {orientationConfirmed && processedDataForHeader && !headerRangeConfirmed && (
        <div className="space-y-4">
          <div className="flex justify-start">
            <Button 
              variant="outline" 
              className="glass-button"
              onClick={() => {
                setOrientationConfirmed(false)
                if (headerRange) {
                  // 別領域ヘッダーを使用している場合
                  setSeparateHeaderConfirmed(false)
                  setHeaderRange(null)
                }
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              前に戻る
            </Button>
          </div>
          <HeaderRangeSelector
            processedData={processedDataForHeader}
            onHeaderRangeConfirm={handleHeaderRangeConfirm}
            onReset={onReset}
          />
        </div>
      )}

      {/* 列選択エリア */}
      {headerRangeConfirmed && processedData && processedData.headers.length >= 2 && !axisSelected && (
        <div className="space-y-4">
          <div className="flex justify-start">
            <Button 
              variant="outline" 
              className="glass-button"
              onClick={() => {
                setHeaderRangeConfirmed(false)
                setProcessedData(null)
                setXColumn('')
                setYColumn('')
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              前に戻る
            </Button>
          </div>
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

            <Button 
              className="w-full glass-button" 
              onClick={handleAxisSelect}
              disabled={!xColumn || !yColumn}
            >
              次へ：単位とスケールを設定
            </Button>
          </CardContent>
        </Card>
        </div>
      )}

      {/* 単位設定エリア */}
      {axisSelected && !unitSettings && (
        <UnitSettings
          xColumn={xColumn}
          yColumn={yColumn}
          sampleData={processedData.data}
          onConfirm={handleUnitConfirm}
          onBack={() => setAxisSelected(false)}
          onReset={onReset}
        />
      )}

      {/* サンプルデータ表示エリア */}
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