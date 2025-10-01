import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Upload, FileText, AlertCircle, CheckCircle2, ChevronDown, Table } from 'lucide-react'
import { parseFile, extractHeadersAndData, inferHeaderRow, transformDataForChart, formatFileSize } from '@/lib/dataUtils.js'

export function FileUpload({ onDataLoaded }) {
  const [file, setFile] = useState(null)
  const [rawRows, setRawRows] = useState(null) // 生の行データ
  const [processedData, setProcessedData] = useState(null) // ヘッダー抽出後のデータ
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [headerRowIndex, setHeaderRowIndex] = useState(null) // ユーザーが選択したヘッダー行のインデックス
  const [xColumn, setXColumn] = useState('')
  const [yColumn, setYColumn] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [showSampleData, setShowSampleData] = useState(false) // サンプルデータ表示フラグ
  const [sampleData, setSampleData] = useState(null) // サンプルデータの内容

  // ヘッダー行が変更されたときにデータを再処理
  useEffect(() => {
    if (rawRows && headerRowIndex !== null) {
      try {
        const { headers, data } = extractHeadersAndData(rawRows, headerRowIndex)
        setProcessedData({ headers, data, rowCount: data.length })
        // ヘッダーが変更されたら、X/Y軸の選択をリセットまたは再設定
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
  }, [rawRows, headerRowIndex])

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
    setProcessedData(null)
    setHeaderRowIndex(null)
    setXColumn('')
    setYColumn('')

    try {
      const parsedData = await parseFile(selectedFile)
      setRawRows(parsedData.rawRows)
      
      // ヘッダー行を自動推定
      const inferredIndex = inferHeaderRow(parsedData.rawRows)
      setHeaderRowIndex(inferredIndex)

    } catch (err) {
      setError(err.message)
      setFile(null)
      setRawRows(null)
      setProcessedData(null)
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
    setProcessedData(null)
    setHeaderRowIndex(null)
    setXColumn('')
    setYColumn('')
    setError(null)
    // ファイル入力をリセット
    const fileInput = document.getElementById('file-input')
    if (fileInput) fileInput.value = ''
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* ファイルアップロードエリア */}
      <Card className="glass-card fade-in stagger-animation float-animation">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl mb-2">データファイルをアップロード</CardTitle>
          <CardDescription className="text-lg">
            縦軸と横軸のデータを含むCSVファイルをアップロードしてください
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
          
          {/* ファイル情報表示 */}
          {file && (
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

          {/* ファイル形式説明 */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              ファイル形式について
            </h3>
            <ul className="text-blue-800 dark:text-blue-200 space-y-1 text-sm">
              <li>• CSV形式またはExcel形式（.xlsx, .xls）に対応</li>
              <li>• 1行目にヘッダー（列名）を含めることを推奨しますが、後から選択可能です。</li>
              <li>• 最低2列のデータ（X軸、Y軸）が必要です</li>
              <li>• 数値データは自動的に認識されます</li>
              <li>• 日本語を含む多言語の列名やデータに対応しています。</li>
            </ul>
          </div>
        </CardContent>
      </Card>

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
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <p>この例では、1行目がヘッダー（列名）となっており、各列にデータが整理されています。</p>
                <p><strong>X軸（横軸）</strong>には「月」のようなカテゴリデータや時系列データ、<strong>Y軸（縦軸）</strong>には「売上」や「顧客数」のような数値データが適しています。</p>
                <p>ただし、X軸とY軸のデータタイプは、アップロード後に柔軟に選択・調整可能です。例えば、X軸に数値、Y軸にカテゴリデータを選択することもできますが、グラフの種類によっては視覚的に分かりにくくなる場合があります。</p>
                <p>日本語を含む多言語の列名やデータも問題なく認識し、グラフに反映されます。</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ヘッダー行選択とデータプレビュー */}
      {rawRows && rawRows.length > 0 && (
        <Card className="glass-card fade-in stagger-animation">
          <CardHeader>
            <CardTitle>ヘッダー行の選択とデータプレビュー</CardTitle>
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

      {/* 列選択エリア */}
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
    </div>
  )
}
