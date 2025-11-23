import Papa from 'papaparse'
import * as XLSX from 'xlsx'

/**
 * CSVファイルのエンコーディングを自動検出して解析する
 * @param {File} file - CSVファイル
 * @returns {Promise<Object>} 解析されたデータ
 */
const parseCSVWithEncoding = async (file) => {
  // エンコーディング候補を優先順位順に定義
  const encodings = ['UTF-8', 'Shift_JIS', 'EUC-JP']
  
  for (const encoding of encodings) {
    try {
      const text = await readFileAsText(file, encoding)
      
      // PapaParseで解析を試行
      const result = await new Promise((resolve, reject) => {
        Papa.parse(text, {
          header: false,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors.length > 0) {
              reject(new Error('解析エラー'))
              return
            }
            resolve(results)
          },
          error: (error) => {
            reject(error)
          }
        })
      })

      // 文字化けチェック: 日本語が正しく読めているか確認
      const hasValidJapanese = result.data.some(row => 
        row.some(cell => {
          const str = String(cell)
          // 日本語文字が含まれているか、または文字化けしていないかをチェック
          // 文字化けの特徴: �や不自然な文字の連続
          return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(str) && 
                 !/�/.test(str)
        })
      )

      // 日本語が含まれていない場合でも、文字化けがなければOK
      const hasGarbledText = result.data.some(row =>
        row.some(cell => /�/.test(String(cell)))
      )

      if (!hasGarbledText) {
        console.log(`CSV読み込み成功: エンコーディング = ${encoding}`)
        return result.data
      }
    } catch (err) {
      // このエンコーディングでは失敗、次を試行
      console.log(`${encoding}での読み込みに失敗、次を試行...`)
      continue
    }
  }

  // すべてのエンコーディングで失敗した場合、UTF-8で再試行（フォールバック）
  console.log('すべてのエンコーディングで失敗、UTF-8で再試行')
  const text = await readFileAsText(file, 'UTF-8')
  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error('CSVファイルの解析中にエラーが発生しました'))
          return
        }
        resolve(results.data)
      },
      error: (error) => {
        reject(new Error('ファイルの読み込みに失敗しました'))
      }
    })
  })
}

/**
 * 指定されたエンコーディングでファイルをテキストとして読み込む
 * @param {File} file - 読み込むファイル
 * @param {string} encoding - エンコーディング (UTF-8, Shift_JIS, EUC-JP等)
 * @returns {Promise<string>} 読み込まれたテキスト
 */
const readFileAsText = (file, encoding) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (error) => reject(error)
    reader.readAsText(file, encoding)
  })
}

/**
 * ファイルを解析してデータを返す (CSV/Excel対応)
 * ヘッダーを自動で認識せず、全ての行をデータとして返す
 * @param {File} file - アップロードされたファイル
 * @param {string} sheetName - Excelの場合に読み込むシート名（オプション）
 * @returns {Promise<Object>} 解析されたデータ
 */
export const parseFile = async (file, sheetName = null) => {
  const fileExtension = file.name.toLowerCase().split('.').pop()

  if (fileExtension === 'csv') {
    try {
      const rawRows = await parseCSVWithEncoding(file)
      if (rawRows.length === 0) {
        throw new Error('ファイルにデータが含まれていません')
      }
      return { rawRows, rowCount: rawRows.length, sheetNames: null }
    } catch (err) {
      throw new Error(err.message || 'CSVファイルの読み込みに失敗しました')
    }
  } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' })
          const sheetNames = workbook.SheetNames
          
          // シート名が指定されていない場合は最初のシートを使用
          const targetSheetName = sheetName || sheetNames[0]
          
          // 指定されたシート名が存在するか確認
          if (!sheetNames.includes(targetSheetName)) {
            reject(new Error(`シート "${targetSheetName}" が見つかりません`))
            return
          }
          
          const worksheet = workbook.Sheets[targetSheetName]
          const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false, defval: "" })

          if (rawRows.length === 0) {
            reject(new Error('ファイルにデータが含まれていません'))
            return
          }
          resolve({ 
            rawRows, 
            rowCount: rawRows.length,
            sheetNames: sheetNames,
            selectedSheet: targetSheetName
          })
        } catch (err) {
          reject(new Error('Excelファイルの解析中にエラーが発生しました: ' + err.message))
        }
      }
      reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'))
      reader.readAsArrayBuffer(file)
    })
  } else {
    throw new Error('サポートされていないファイル形式です。CSV、Excel形式のファイルをアップロードしてください。')
  }
}

/**
 * 指定された行をヘッダーとして、データとヘッダーを抽出する
 * @param {Array<Array<string>>} rawRows - 生のデータ行
 * @param {number} headerRowIndex - ヘッダーとして使用する行のインデックス (0-indexed)
 * @returns {Object} headersとdataを含むオブジェクト
 */
export const extractHeadersAndData = (rawRows, headerRowIndex) => {
  if (headerRowIndex < 0 || headerRowIndex >= rawRows.length) {
    throw new Error('無効なヘッダー行インデックスです。')
  }

  const headers = rawRows[headerRowIndex].map(h => h ? String(h).trim() : `Column ${rawRows[headerRowIndex].indexOf(h) + 1}`)
  const dataRows = rawRows.slice(headerRowIndex + 1)

  const data = dataRows.map(row => {
    const obj = {}
    headers.forEach((header, index) => {
      obj[header] = row[index] !== undefined ? String(row[index]).trim() : ''
    })
    return obj
  }).filter(obj => Object.values(obj).some(val => val !== '')) // 全て空の行は除外

  // ヘッダーが重複している場合はユニークにする
  const uniqueHeaders = []
  const headerMap = new Map()
  headers.forEach(header => {
    let currentHeader = header
    let counter = 1
    while(headerMap.has(currentHeader)) {
      currentHeader = `${header}_${counter}`
      counter++
    }
    headerMap.set(currentHeader, true)
    uniqueHeaders.push(currentHeader)
  })

  return {
    headers: uniqueHeaders,
    data
  }
}

/**
 * ヘッダー行を自動推定する
 * @param {Array<Array<string>>} rawRows - 生のデータ行
 * @returns {number} 推定されたヘッダー行のインデックス
 */
export const inferHeaderRow = (rawRows) => {
  if (rawRows.length === 0) return -1

  // 最初の数行を分析対象とする (例: 最初の5行)
  const sampleRows = rawRows.slice(0, Math.min(rawRows.length, 5))

  let bestHeaderRowIndex = 0
  let maxNonNumericRatio = -1

  sampleRows.forEach((row, index) => {
    if (row.length === 0) return

    let nonNumericCount = 0
    row.forEach(cell => {
      const cleanedCell = String(cell).trim()
      if (cleanedCell === '' || isNaN(Number(cleanedCell))) {
        nonNumericCount++
      }
    })

    const nonNumericRatio = nonNumericCount / row.length

    // 非数値の割合が高い行をヘッダー候補とする
    // また、最初の行はヘッダーである可能性が高いので優先する
    if (nonNumericRatio > maxNonNumericRatio || (index === 0 && nonNumericRatio >= 0.5)) {
      maxNonNumericRatio = nonNumericRatio
      bestHeaderRowIndex = index
    }
  })

  // 非数値の割合が低い（ほとんど数値）場合は、ヘッダーではない可能性が高いので、
  // その次の行をヘッダーとして推定するなどのロジックも考えられるが、
  // ここでは最も非数値が多い行をヘッダーと推定するシンプルなロジックを採用
  // ただし、全ての行が数値のみの場合、最初の行をヘッダーとする
  if (maxNonNumericRatio === 0 && rawRows.length > 1) {
    return 0 // 全て数値の場合は最初の行をヘッダーとする
  }

  return bestHeaderRowIndex
}

/**
 * データを数値型に変換する
 * @param {string} value - 変換する値
 * @param {string} parenthesesMode - 括弧の解釈方法 ('positive': 正の数, 'negative': 負の数)
 * @returns {number|string} 数値または元の文字列
 */
export const parseNumericValue = (value, parenthesesMode = 'positive') => {
  if (typeof value === 'number') return value
  if (typeof value !== 'string') return value
  
  // 空文字列や null の場合
  if (!value || value.trim() === '') return 0
  
  // 三角形記号（△）がマイナスを表す場合の処理
  let isNegative = false
  let cleanValue = value
  
  // △記号をチェック（全角・半角両方に対応）
  if (/[△▲]/.test(cleanValue)) {
    isNegative = true
    // △記号を除去
    cleanValue = cleanValue.replace(/[△▲]/g, '')
  }
  
  // 括弧付き数字の処理
  // パターン1: 数字全体が両側の括弧で囲まれている場合 "(1,000)" や "（1,000）"
  const fullParenthesesMatch = cleanValue.match(/^[\(（]\s*([\d,.\s]+)\s*[\)）]$/)
  if (fullParenthesesMatch) {
    cleanValue = fullParenthesesMatch[1]  // 括弧内の数値部分を取得
    // parenthesesMode が 'negative' の場合のみ負数として扱う
    if (parenthesesMode === 'negative') {
      isNegative = true
    }
  } else {
    // パターン2: 片側の括弧のみの場合（複数セルに跨る括弧）
    // 左括弧のみ: "( 4 326 506" や "（4326506"
    if (/^[\(（]\s*[\d,.\s]+$/.test(cleanValue)) {
      cleanValue = cleanValue.replace(/^[\(（]\s*/, '')
      if (parenthesesMode === 'negative') {
        isNegative = true
      }
    }
    // 右括弧のみ: "4 326 506 )" や "4326506）"
    else if (/^[\d,.\s]+\s*[\)）]$/.test(cleanValue)) {
      cleanValue = cleanValue.replace(/\s*[\)）]$/, '')
      if (parenthesesMode === 'negative') {
        isNegative = true
      }
    }
    // パターン3: 先頭に番号表記がある場合 "1)" や "(1)" など（半角・全角対応）
    else {
      cleanValue = cleanValue.replace(/^[\(（]?[0-9０-９]+[\)）]\s*/, '')
    }
  }
  
  // カンマとスペースを除去
  cleanValue = cleanValue.replace(/[\s,]/g, '')
  
  // 数値に変換を試行
  const numValue = parseFloat(cleanValue)
  
  // 有効な数値の場合
  if (!isNaN(numValue)) {
    // △があった場合やparenthesesModeがnegativeでカッコがあった場合はマイナスにする
    return isNegative ? -numValue : numValue
  }
  
  // 数値に変換できない場合は元の値を返す
  return value
}

/**
 * データに括弧で囲まれた数字が含まれているかを検出する
 * @param {Array} values - 値の配列
 * @returns {Object} { hasParentheses: boolean, examples: Array<string> }
 */
export const detectParenthesesInData = (values) => {
  const examples = []
  let hasParentheses = false
  
  // 数字全体が括弧で囲まれているパターンを検出
  const fullParenthesesPattern = /^[\(（]\s*[\d,.\s]+\s*[\)）]$/
  
  for (let i = 0; i < values.length && examples.length < 3; i++) {
    const value = String(values[i] || '').trim()
    if (value && fullParenthesesPattern.test(value)) {
      hasParentheses = true
      examples.push(value)
    }
  }
  
  return {
    hasParentheses,
    examples
  }
}

/**
 * データの型を推定する
 * @param {Array} values - 値の配列
 * @param {string} parenthesesMode - 括弧の解釈方法
 * @returns {string} 'numeric' | 'categorical'
 */
export const inferDataType = (values, parenthesesMode = 'positive') => {
  let numericCount = 0
  const sampleSize = Math.min(values.length, 10) // 最初の10個をサンプルとして使用
  
  for (let i = 0; i < sampleSize; i++) {
    const parsed = parseNumericValue(values[i], parenthesesMode)
    if (typeof parsed === 'number' && !isNaN(parsed)) {
      numericCount++
    }
  }
  
  // 70%以上が数値の場合は数値型とみなす
  return (numericCount / sampleSize) >= 0.7 ? 'numeric' : 'categorical'
}

/**
 * グラフ用にデータを変換する
 * @param {Object} processedData - 生データ
 * @param {string} xColumn - X軸の列名
 * @param {string} yColumn - Y軸の列名
 * @param {string} parenthesesMode - 括弧の解釈方法 ('positive' | 'negative')
 * @returns {Object} グラフ用データ
 */
export const transformDataForChart = (processedData, xColumn, yColumn, parenthesesMode = 'positive') => {
  console.log('====================')
  console.log('=== transformDataForChart START ===')
  console.log('====================')
  console.log('xColumn:', xColumn)
  console.log('yColumn:', yColumn)
  console.log('parenthesesMode:', parenthesesMode)
  console.log('processedData.headers:', processedData.headers)
  console.log('processedData.data.length:', processedData.data.length)
  
  const { data } = processedData
  
  console.log('First 3 data rows (full objects):')
  data.slice(0, 3).forEach((row, i) => {
    console.log(`Row ${i}:`, row)
    console.log(`  ${xColumn} = "${row[xColumn]}"`)
    console.log(`  ${yColumn} = "${row[yColumn]}"`)
  })
  
  // X軸とY軸のデータを抽出
  const xValues = data.map(row => row[xColumn])
  const yValues = data.map(row => row[yColumn])
  
  console.log('---')
  console.log('xValues (first 5):', xValues.slice(0, 5))
  console.log('yValues (first 5):', yValues.slice(0, 5))
  
  // データ型を推定
  const xType = inferDataType(xValues, parenthesesMode)
  const yType = inferDataType(yValues, parenthesesMode)
  
  console.log('---')
  console.log('xType:', xType)
  console.log('yType:', yType)
  
  // グラフ用にデータを変換
  const chartData = data.map((row, index) => {
    const xRaw = row[xColumn]
    const yRaw = row[yColumn]
    
    const xValue = xType === 'numeric' ? parseNumericValue(xRaw, parenthesesMode) : xRaw
    const yValue = yType === 'numeric' ? parseNumericValue(yRaw, parenthesesMode) : yRaw
    
    if (index < 5) {
      console.log(`---`)
      console.log(`Processing Row ${index}:`)
      console.log(`  xRaw: "${xRaw}" (type: ${typeof xRaw})`)
      console.log(`  yRaw: "${yRaw}" (type: ${typeof yRaw})`)
      console.log(`  xValue: ${xValue} (parsed type: ${typeof xValue})`)
      console.log(`  yValue: ${yValue} (parsed type: ${typeof yValue})`)
    }
    
    return {
      x: xValue,
      y: yValue,
      label: xRaw
    }
  }).filter(item => item.x !== null && item.y !== null)
  
  console.log('---')
  console.log('Final chartData count:', chartData.length)
  console.log('Final chartData (first 3):')
  chartData.slice(0, 3).forEach((item, i) => {
    console.log(`  Item ${i}:`, item)
  })
  console.log('Final labels (first 5):', chartData.slice(0, 5).map(item => item.label))
  console.log('Final values (first 5):', chartData.slice(0, 5).map(item => item.y))
  console.log('====================')
  
  return {
    chartData,
    xColumn,
    yColumn,
    xType,
    yType,
    labels: chartData.map(item => item.label),
    values: chartData.map(item => item.y)
  }
}

/**
 * 円グラフ用にデータを集計する
 * @param {Array} data - データ配列
 * @param {string} labelColumn - ラベル列
 * @param {string} valueColumn - 値列
 * @param {Object} options - オプション設定
 * @param {number} options.maxSlices - 最大表示スライス数（その他を除く）
 * @param {number} options.minPercentage - 最小表示パーセンテージ（この値未満は「その他」に統合）
 * @param {boolean} options.showOthers - 「その他」を表示するか
 * @param {string} options.parenthesesMode - 括弧の解釈方法
 * @returns {Object} 円グラフ用データ
 */
export const aggregateDataForPieChart = (data, labelColumn, valueColumn, options = {}) => {
  const {
    maxSlices = 10,
    minPercentage = 2,
    showOthers = true,
    parenthesesMode = 'positive'
  } = options
  
  const aggregated = {}
  
  // データを集計
  data.forEach(row => {
    const label = row[labelColumn]
    const value = parseNumericValue(row[valueColumn], parenthesesMode)
    
    if (typeof value === 'number' && !isNaN(value)) {
      aggregated[label] = (aggregated[label] || 0) + value
    }
  })
  
  // ラベルと値の配列を作成し、値で降順ソート
  let chartData = Object.entries(aggregated)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
  
  // 合計値を計算
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0)
  
  // フィルタリング処理
  let mainData = []
  let othersData = []
  
  if (showOthers && chartData.length > maxSlices) {
    // パーセンテージ閾値でフィルタリング
    chartData.forEach((item, index) => {
      const percentage = (item.value / totalValue) * 100
      
      // 上位maxSlices個以内かつminPercentage以上のデータを表示
      if (index < maxSlices && percentage >= minPercentage) {
        mainData.push(item)
      } else {
        othersData.push(item)
      }
    })
    
    // 「その他」が存在する場合
    if (othersData.length > 0) {
      const othersValue = othersData.reduce((sum, item) => sum + item.value, 0)
      const othersPercentage = (othersValue / totalValue) * 100
      
      // 「その他」が存在し、かつ意味のある値（0.1%以上）の場合のみ追加
      if (othersPercentage >= 0.1) {
        mainData.push({
          label: 'その他',
          value: othersValue,
          isOthers: true,
          itemCount: othersData.length,
          items: othersData.map(item => item.label)
        })
      } else {
        // 「その他」が無視できるほど小さい場合は、メインデータに統合
        mainData = [...mainData, ...othersData]
      }
    }
  } else {
    // データ数が少ない場合はすべて表示
    mainData = chartData
  }
  
  const labels = mainData.map(item => item.label)
  const values = mainData.map(item => item.value)
  
  return {
    labels,
    values,
    chartData: mainData,
    totalValue,
    hasOthers: mainData.some(item => item.isOthers)
  }
}

/**
 * ファイルサイズを人間が読みやすい形式に変換
 * @param {number} bytes - バイト数
 * @returns {string} フォーマットされたサイズ
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
