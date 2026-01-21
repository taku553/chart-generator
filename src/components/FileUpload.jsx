import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Upload, FileText, AlertCircle, CheckCircle2, Table, ArrowLeft, Home } from 'lucide-react'
import { parseFile, transformDataForChart, detectParenthesesInData } from '@/lib/dataUtils.js'
import { processSelectedRange, combineHeaderAndDataRanges } from '@/lib/dataTransform.js'
import { DataRangeSelector } from '@/components/DataRangeSelector.jsx'
import { DataOrientationSelector } from '@/components/DataOrientationSelector.jsx'
import { HeaderRangeSelector } from '@/components/HeaderRangeSelector.jsx'
import { DataLabelRangeSelector } from '@/components/DataLabelRangeSelector.jsx'
import { UnitSettings } from '@/components/UnitSettings.jsx'
import { SeparateHeaderSelector } from '@/components/SeparateHeaderSelector.jsx'
import { SheetSelector } from '@/components/SheetSelector.jsx'
import { ChartTitleSettings } from '@/components/ChartTitleSettings.jsx'
import { ParenthesesInterpretationSelector } from '@/components/ParenthesesInterpretationSelector.jsx'
import { useLanguage } from '@/contexts/LanguageContext'

export function FileUpload({ onDataLoaded, isReconfiguring = false, savedConfiguration = null, onReset }) {
  const { t } = useLanguage()
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
  const [dataRowsOnly, setDataRowsOnly] = useState(null) // ヘッダー除外後のデータ行のみ
  const [dataLabels, setDataLabels] = useState(null)
  const [labelRange, setLabelRange] = useState(null) // データラベル範囲情報
  const [labelRangeConfirmed, setLabelRangeConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [xColumn, setXColumn] = useState('')
  const [yColumn, setYColumn] = useState('')
  const [axisSelected, setAxisSelected] = useState(false)
  const [parenthesesMode, setParenthesesMode] = useState('positive')
  const [parenthesesDetected, setParenthesesDetected] = useState(false)
  const [parenthesesExamples, setParenthesesExamples] = useState([])
  const [parenthesesConfirmed, setParenthesesConfirmed] = useState(false)
  const [unitSettings, setUnitSettings] = useState(null)
  const [chartTitle, setChartTitle] = useState('')
  const [titleConfirmed, setTitleConfirmed] = useState(false)
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
    if (isReconfiguring && savedConfiguration) {
      // ファイル情報を復元
      setFile(savedConfiguration.file)
      setRawRows(savedConfiguration.rawRows)
      setSheetNames(savedConfiguration.sheetNames)
      setSelectedSheet(savedConfiguration.selectedSheet)
      
      // シート選択状態を復元
      if (!savedConfiguration.sheetNames || savedConfiguration.sheetNames.length <= 1) {
        setSheetSelectionConfirmed(true)
      } else {
        setSheetSelectionConfirmed(savedConfiguration.sheetSelectionConfirmed || false)
      }
      
      // データ範囲を復元
      if (savedConfiguration.selectedRange) {
        setSelectedRange(savedConfiguration.selectedRange)
      }
      
      // ヘッダー設定を復元
      if (savedConfiguration.separateHeaderConfirmed !== undefined) {
        setSeparateHeaderConfirmed(savedConfiguration.separateHeaderConfirmed)
      }
      if (savedConfiguration.headerRange) {
        setHeaderRange(savedConfiguration.headerRange)
      }
      
      // データ方向を復元
      if (savedConfiguration.orientationConfirmed) {
        setOrientationConfirmed(savedConfiguration.orientationConfirmed)
      }
      if (savedConfiguration.processedDataForHeader) {
        setProcessedDataForHeader(savedConfiguration.processedDataForHeader)
      }
      
      // ヘッダー範囲を復元
      if (savedConfiguration.headerRangeConfirmed) {
        setHeaderRangeConfirmed(savedConfiguration.headerRangeConfirmed)
      }
      if (savedConfiguration.processedData) {
        setProcessedData(savedConfiguration.processedData)
      }
      if (savedConfiguration.dataRowsOnly) {
        setDataRowsOnly(savedConfiguration.dataRowsOnly)
      }
      
      // データラベル範囲を復元
      if (savedConfiguration.labelRangeConfirmed !== undefined) {
        setLabelRangeConfirmed(savedConfiguration.labelRangeConfirmed)
      }
      if (savedConfiguration.dataLabels) {
        setDataLabels(savedConfiguration.dataLabels)
      }
      if (savedConfiguration.labelRange) {
        setLabelRange(savedConfiguration.labelRange)
      }
      
      // 軸設定を復元
      if (savedConfiguration.xColumn) {
        setXColumn(savedConfiguration.xColumn)
      }
      if (savedConfiguration.yColumn) {
        setYColumn(savedConfiguration.yColumn)
      }
      if (savedConfiguration.axisSelected) {
        setAxisSelected(savedConfiguration.axisSelected)
      }
      
      // 括弧解釈設定を復元
      if (savedConfiguration.parenthesesMode) {
        setParenthesesMode(savedConfiguration.parenthesesMode)
      }
      if (savedConfiguration.parenthesesDetected !== undefined) {
        setParenthesesDetected(savedConfiguration.parenthesesDetected)
      }
      if (savedConfiguration.parenthesesExamples) {
        setParenthesesExamples(savedConfiguration.parenthesesExamples)
      }
      if (savedConfiguration.parenthesesConfirmed !== undefined) {
        setParenthesesConfirmed(savedConfiguration.parenthesesConfirmed)
      }
      
      // 単位設定を復元
      if (savedConfiguration.unitSettings) {
        setUnitSettings(savedConfiguration.unitSettings)
      }
      
      // タイトル設定を復元
      if (savedConfiguration.chartTitle) {
        setChartTitle(savedConfiguration.chartTitle)
      }
      if (savedConfiguration.titleConfirmed !== undefined) {
        setTitleConfirmed(savedConfiguration.titleConfirmed)
      }
      
      setError(null)
      setLoading(false)
    }
  }, [isReconfiguring, savedConfiguration])

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
    setDataRowsOnly(null)
    setDataLabels(null)
    setLabelRange(null)
    setLabelRangeConfirmed(false)
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
    // 結合したデータを一時保存（転置判断のため）
    setSelectedRange(prev => ({
      ...prev,
      data: combinedData
    }))
    // 向き確認画面を表示するため、orientationConfirmedはfalseのまま
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
  const handleHeaderRangeConfirm = ({ headers, data, headerRange, hasEmptyHeaders, emptyHeaderCount }) => {
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
    
    // 空欄ヘッダーの警告ログ
    if (hasEmptyHeaders) {
      console.warn(`⚠️ Warning: ${emptyHeaderCount} empty header(s) detected. These columns will be excluded from axis selection.`)
    }
    
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
    
    // データ行のみを配列形式で保存（データ名列範囲選択用）
    setDataRowsOnly(data)
    
    setProcessedData({ 
      headers, 
      data: formattedData,
      rowCount: formattedData.length 
    })
    
    setHeaderRangeConfirmed(true)
    
    // 有効なヘッダー（空欄でないもの）のみをフィルタリング
    const validHeaders = headers.filter(h => h && h.trim() !== '')
    
    // デフォルトでX軸とY軸を設定（有効なヘッダーから）
    if (validHeaders.length >= 2) {
      console.log('Setting default columns:')
      console.log('  X-axis:', validHeaders[0])
      console.log('  Y-axis:', validHeaders[validHeaders.length - 1]) // 最後の列をY軸に
      setXColumn(validHeaders[0])
      setYColumn(validHeaders[validHeaders.length - 1])
    }
  }

  // データラベル範囲確定後の処理（NEW）
  const handleLabelRangeConfirm = ({ labels, labelRange: range, columnName }) => {
    console.log('=== Label Range Confirm ===')
    console.log('Labels:', labels)
    console.log('Label range:', range)
    console.log('Column name:', columnName)
    
    setDataLabels(labels)
    setLabelRange(range)
    
    // processedDataを更新して、結合されたデータ名を新しい列として追加
    if (processedData && labels && labels.length > 0) {
      const mergedColumnName = columnName || 'データ名'
      const updatedHeaders = [mergedColumnName, ...processedData.headers]
      const updatedData = processedData.data.map((row, index) => {
        return {
          [mergedColumnName]: labels[index] || '',
          ...row
        }
      })
      
      console.log('Updated headers:', updatedHeaders)
      console.log('Updated data (first 3 rows):', updatedData.slice(0, 3))
      
      setProcessedData({
        headers: updatedHeaders,
        data: updatedData,
        rowCount: updatedData.length
      })
      
      // X軸のデフォルトを結合後の列名に設定
      setXColumn(mergedColumnName)
      
      // Y軸はそのまま（数値列の最後）
      if (processedData.headers.length > 0) {
        setYColumn(processedData.headers[processedData.headers.length - 1])
      }
    }
    
    setLabelRangeConfirmed(true)
  }  // データラベル範囲選択をスキップ
  const handleSkipLabelRange = () => {
    console.log('=== Skipping Label Range Selection ===')
    setDataLabels(null)
    setLabelRange(null)
    setLabelRangeConfirmed(true)
  }

  // 軸選択確定処理
  const handleAxisSelect = () => {
    if (!xColumn || !yColumn) return
    
    // Y軸データに括弧付き数字が含まれているか検出
    const yValues = processedData.data.map(row => row[yColumn])
    const detection = detectParenthesesInData(yValues)
    
    if (detection.hasParentheses) {
      setParenthesesDetected(true)
      setParenthesesExamples(detection.examples)
      // 括弧検出時は括弧解釈設定画面へ
    } else {
      // 括弧なしの場合はスキップ
      setParenthesesDetected(false)
      setParenthesesConfirmed(true)
    }
    
    setAxisSelected(true)
  }
  
  // 括弧解釈設定確定後の処理
  const handleParenthesesConfirm = (mode) => {
    setParenthesesMode(mode)
    setParenthesesConfirmed(true)
  }

  // 単位設定確定後の処理
  const handleUnitConfirm = (units) => {
    setUnitSettings(units)
    // グラフ生成ではなくタイトル設定画面へ
  }

  // グラフタイトル確定後の処理
  const handleTitleConfirm = (title) => {
    setChartTitle(title)
    setTitleConfirmed(true)
    handleGenerateChart(title)
  }

  // グラフ生成処理
  const handleGenerateChart = (title = chartTitle) => {
    if (!processedData || !xColumn || !yColumn) return

    try {
      const chartData = transformDataForChart(processedData, xColumn, yColumn, parenthesesMode)
      
      // 単位設定を追加
      chartData.unitSettings = unitSettings
      
      // グラフタイトルを追加
      chartData.chartTitle = title
      
      // AI解説用の拡張データを追加
      chartData.sourceData = {
        rawRows: rawRows, // 元の表データ全体
        selectedRange: selectedRange, // 選択されたデータ範囲
        headerRange: headerRange, // ヘッダー範囲
        labelRange: labelRange, // データラベル範囲
        originalXColumn: xColumn, // 元のX軸カラム名
        originalYColumn: yColumn, // 元のY軸カラム名
        renamedTitle: title, // 変更後のタイトル
        fileName: file?.name // ファイル名
      }
      
      // すべての設定内容を保存して親に渡す
      const configuration = {
        // ファイル情報
        file: file,
        rawRows: rawRows,
        sheetNames: sheetNames,
        selectedSheet: selectedSheet,
        sheetSelectionConfirmed: sheetSelectionConfirmed,
        
        // データ範囲
        selectedRange: selectedRange,
        
        // ヘッダー設定
        separateHeaderConfirmed: separateHeaderConfirmed,
        headerRange: headerRange,
        
        // データ方向
        orientationConfirmed: orientationConfirmed,
        processedDataForHeader: processedDataForHeader,
        
        // ヘッダー範囲
        headerRangeConfirmed: headerRangeConfirmed,
        processedData: processedData,
        dataRowsOnly: dataRowsOnly,
        
        // データラベル範囲
        labelRange: labelRange,
        labelRangeConfirmed: labelRangeConfirmed,
        dataLabels: dataLabels,
        
        // 軸設定
        xColumn: xColumn,
        yColumn: yColumn,
        axisSelected: axisSelected,
        
        // 括弧解釈設定
        parenthesesMode: parenthesesMode,
        parenthesesDetected: parenthesesDetected,
        parenthesesExamples: parenthesesExamples,
        parenthesesConfirmed: parenthesesConfirmed,
        
        // 単位設定
        unitSettings: unitSettings,
        
        // タイトル設定
        chartTitle: title,
        titleConfirmed: titleConfirmed
      }
      
      onDataLoaded(chartData, configuration)
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
    setDataRowsOnly(null)
    setDataLabels(null)
    setLabelRange(null)
    setLabelRangeConfirmed(false)
    setXColumn('')
    setYColumn('')
    setAxisSelected(false)
    setParenthesesMode('positive')
    setParenthesesDetected(false)
    setParenthesesExamples([])
    setParenthesesConfirmed(false)
    setUnitSettings(null)
    setChartTitle('')
    setTitleConfirmed(false)
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
            <CardTitle className="text-2xl mb-2">{t('upload.title')}</CardTitle>
            <CardDescription className="text-lg">
              {t('upload.description')}
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
                  {dragActive ? t('upload.dropzone') : t('home.orDragDrop')}
                </p>
                <p className="text-gray-500">{t('upload.or')}</p>
                <Button 
                  variant="outline" 
                  className="glass-button"
                  onClick={() => document.getElementById('file-input').click()}
                  disabled={loading}
                >
                  {t('upload.selectFile')}
                </Button>
                <input
                  id="file-input"
                  type="file"
                  accept=".csv,.xlsx,.xls,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            </div>
            
            {/* ファイル形式説明 */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {t('upload.supportedFormats')}
              </h3>
              <ul className="text-blue-800 dark:text-blue-200 space-y-1 text-sm">
                <li>• CSV, Excel (.xlsx, .xls)</li>
                <li>• {t('upload.maxSize')}</li>
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
                  {sheetNames.length} {t('upload.sheetsFound')}
                </p>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleReset}
              className="text-green-700 hover:text-green-800"
            >
              {t('upload.delete')}
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
                {selectedSheet ? `${t('upload.sheet')}: ${selectedSheet} - ` : ''}{rawRows?.length || 0} {t('upload.rowsOfData')}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleReset}
              className="text-green-700 hover:text-green-800"
            >
              {t('upload.delete')}
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
          </div>{t('upload.loading')}
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
              {t('common.goBack')}
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
      {selectedRange && separateHeaderConfirmed && !orientationConfirmed && (
        <div className="space-y-4">
          <div className="flex justify-start">
            <Button 
              variant="outline" 
              className="glass-button"
              onClick={() => {
                setSeparateHeaderConfirmed(false)
                if (headerRange) {
                  setHeaderRange(null)
                }
              }}
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
              {t('common.goBack')}
            </Button>
          </div>
          <HeaderRangeSelector
            processedData={processedDataForHeader}
            onHeaderRangeConfirm={handleHeaderRangeConfirm}
            onReset={onReset}
          />
        </div>
      )}

      {/* データラベル列範囲選択（NEW） */}
      {headerRangeConfirmed && dataRowsOnly && !labelRangeConfirmed && (
        <div className="space-y-4">
          <div className="flex justify-start">
            <Button 
              variant="outline" 
              className="glass-button"
              onClick={() => {
                setHeaderRangeConfirmed(false)
                setProcessedData(null)
                setDataRowsOnly(null)
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.goBack')}
            </Button>
          </div>
          <DataLabelRangeSelector
            processedData={dataRowsOnly}
            onLabelRangeConfirm={handleLabelRangeConfirm}
            onSkip={handleSkipLabelRange}
            onReset={onReset}
          />
        </div>
      )}

      {/* 列選択エリア */}
      {labelRangeConfirmed && processedData && processedData.headers.length >= 2 && !axisSelected && (
        <div className="space-y-4">
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              className="glass-button"
              onClick={() => {
                setLabelRangeConfirmed(false)
                setDataLabels(null)
                setXColumn('')
                setYColumn('')
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.goBack')}
            </Button>
            
            <Button 
              variant="outline" 
              className="glass-button"
              onClick={onReset}
            >
              <Home className="h-4 w-4 mr-2" />
              {t('common.returnToStart')}
            </Button>
          </div>
          <Card className="glass-card fade-in stagger-animation">
            <CardHeader>
              <CardTitle>{t('axis.title')}</CardTitle>
              <CardDescription>
                {t('axis.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            {/* 古い列を除外したヘッダーリストを作成 */}
            {(() => {
              let availableHeaders = processedData.headers
              
              // データラベル範囲が設定されている場合、その範囲の列を除外
              if (labelRange) {
                availableHeaders = processedData.headers.filter((header, index) => {
                  // 最初の列は結合後の列なのでスキップ
                  if (index === 0) return true
                  
                  // 元のインデックス（結合列を除く）
                  const originalIndex = index - 1
                  
                  // labelRangeの範囲内の列は除外
                  return originalIndex < labelRange.labelStartCol || 
                         originalIndex > labelRange.labelEndCol
                })
              }
              
              // 空欄のヘッダーを除外
              availableHeaders = availableHeaders.filter(h => h && h.trim() !== '')
              
              return (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('axis.xAxisLabel')}</label>
                      <Select value={xColumn} onValueChange={setXColumn}>
                        <SelectTrigger className="glass-button">
                          <SelectValue placeholder={t('axis.selectColumn')} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableHeaders.map((header) => (
                            <SelectItem key={header} value={header}>
                              {header}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('axis.yAxisLabel')}</label>
                      <Select value={yColumn} onValueChange={setYColumn}>
                        <SelectTrigger className="glass-button">
                          <SelectValue placeholder={t('axis.selectColumn')} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableHeaders.map((header) => (
                            <SelectItem key={header} value={header}>
                              {header}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )
            })()}
            
            {/* データプレビュー */}
            {processedData && processedData.data.length > 0 && (() => {
              // 軸選択と同じフィルタリングを適用
              let availableHeaders = processedData.headers
              
              if (labelRange) {
                availableHeaders = processedData.headers.filter((header, index) => {
                  if (index === 0) return true
                  const originalIndex = index - 1
                  return originalIndex < labelRange.labelStartCol || 
                         originalIndex > labelRange.labelEndCol
                })
              }
              
              // 空欄のヘッダーを除外
              availableHeaders = availableHeaders.filter(h => h && h.trim() !== '')
              
              return (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">{t('axis.dataPreview')}</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          {availableHeaders.map((header) => (
                            <th key={header} className="px-3 py-2 text-left font-medium">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {processedData.data.slice(0, 3).map((row, index) => (
                          <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                            {availableHeaders.map((header) => (
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
              )
            })()}

            <Button 
              className="w-full glass-button" 
              onClick={handleAxisSelect}
              disabled={!xColumn || !yColumn}
            >
              {t('axis.next')}
            </Button>
          </CardContent>
        </Card>
        </div>
      )}

      {/* 括弧解釈設定エリア */}
      {axisSelected && parenthesesDetected && !parenthesesConfirmed && (
        <div className="space-y-4">
          <div className="flex justify-start">
            <Button 
              variant="outline" 
              className="glass-button"
              onClick={() => {
                setAxisSelected(false)
                setParenthesesDetected(false)
                setParenthesesExamples([])
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.goBack')}
            </Button>
          </div>
          <ParenthesesInterpretationSelector
            examples={parenthesesExamples}
            defaultMode={parenthesesMode}
            onConfirm={handleParenthesesConfirm}
            onBack={() => {
              setAxisSelected(false)
              setParenthesesDetected(false)
              setParenthesesExamples([])
            }}
            onReset={onReset}
          />
        </div>
      )}

      {/* 単位設定エリア */}
      {axisSelected && parenthesesConfirmed && !unitSettings && (
        <UnitSettings
          xColumn={xColumn}
          yColumn={yColumn}
          sampleData={processedData.data}
          headers={processedData.headers}
          onConfirm={handleUnitConfirm}
          onBack={() => {
            if (parenthesesDetected) {
              setParenthesesConfirmed(false)
            } else {
              setAxisSelected(false)
            }
          }}
          onReset={onReset}
        />
      )}

      {/* グラフタイトル設定エリア */}
      {unitSettings && !titleConfirmed && (
        <div className="space-y-4">
          <div className="flex justify-start">
            <Button 
              variant="outline" 
              className="glass-button"
              onClick={() => setUnitSettings(null)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.goBack')}
            </Button>
          </div>
          <ChartTitleSettings
            defaultTitle={yColumn}
            onConfirm={handleTitleConfirm}
            onBack={() => setUnitSettings(null)}
            onReset={onReset}
          />
        </div>
      )}

      {/* サンプルデータ表示エリア */}
      <Card className="glass-card fade-in stagger-animation">
        <CardHeader>
          <CardTitle>{t('upload.sampleDataTitle')}</CardTitle>
          <CardDescription>
            {t('upload.sampleDataDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="glass-button w-full"
            onClick={() => setShowSampleData(!showSampleData)}
          >
            <Table className="h-4 w-4 mr-2" />
            {showSampleData ? t('upload.hideSampleData') : t('upload.showSampleData')}
          </Button>

          {showSampleData && sampleData && (
            <div className="mt-4 slide-in-bottom">
              <h4 className="text-sm font-medium mb-2">{t('upload.recommendedFormat')}</h4>
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