import Papa from 'papaparse'

/**
 * CSVファイルを解析してデータを返す
 * ヘッダーを自動で認識せず、全ての行をデータとして返す
 * @param {File} file - アップロードされたファイル
 * @returns {Promise<Object>} 解析されたデータ
 */
export const parseCSVFile = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: false, // ヘッダーを自動認識しない
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error('CSVファイルの解析中にエラーが発生しました'))
          return
        }
        
        const rawRows = results.data
        if (rawRows.length === 0) {
          reject(new Error('ファイルにデータが含まれていません'))
          return
        }

        // 全ての行をそのまま返す
        resolve({
          rawRows,
          rowCount: rawRows.length
        })
      },
      error: (error) => {
        reject(new Error('ファイルの読み込みに失敗しました'))
      }
    })
  })
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
 * @returns {number|string} 数値または元の文字列
 */
export const parseNumericValue = (value) => {
  if (typeof value === 'number') return value
  if (typeof value !== 'string') return value
  
  // 空文字列や null の場合
  if (!value || value.trim() === '') return 0
  
  // カンマを除去
  const cleanValue = value.replace(/,/g, '')
  
  // 数値に変換を試行
  const numValue = parseFloat(cleanValue)
  
  // 有効な数値の場合は数値を返し、そうでなければ元の値を返す
  return !isNaN(numValue) ? numValue : value
}

/**
 * データの型を推定する
 * @param {Array} values - 値の配列
 * @returns {string} 'numeric' | 'categorical'
 */
export const inferDataType = (values) => {
  let numericCount = 0
  const sampleSize = Math.min(values.length, 10) // 最初の10個をサンプルとして使用
  
  for (let i = 0; i < sampleSize; i++) {
    const parsed = parseNumericValue(values[i])
    if (typeof parsed === 'number' && !isNaN(parsed)) {
      numericCount++
    }
  }
  
  // 70%以上が数値の場合は数値型とみなす
  return (numericCount / sampleSize) >= 0.7 ? 'numeric' : 'categorical'
}

/**
 * グラフ用にデータを変換する
 * @param {Object} rawData - 生データ
 * @param {string} xColumn - X軸の列名
 * @param {string} yColumn - Y軸の列名
 * @returns {Object} グラフ用データ
 */
export const transformDataForChart = (processedData, xColumn, yColumn) => {
  const { data } = processedData
  
  // X軸とY軸のデータを抽出
  const xValues = data.map(row => row[xColumn])
  const yValues = data.map(row => row[yColumn])
  
  // データ型を推定
  const xType = inferDataType(xValues)
  const yType = inferDataType(yValues)
  
  // グラフ用にデータを変換
  const chartData = data.map(row => ({
    x: xType === 'numeric' ? parseNumericValue(row[xColumn]) : row[xColumn],
    y: yType === 'numeric' ? parseNumericValue(row[yColumn]) : row[yColumn],
    label: row[xColumn]
  })).filter(item => item.x !== null && item.y !== null)
  
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
 * @returns {Object} 円グラフ用データ
 */
export const aggregateDataForPieChart = (data, labelColumn, valueColumn) => {
  const aggregated = {}
  
  data.forEach(row => {
    const label = row[labelColumn]
    const value = parseNumericValue(row[valueColumn])
    
    if (typeof value === 'number' && !isNaN(value)) {
      aggregated[label] = (aggregated[label] || 0) + value
    }
  })
  
  const labels = Object.keys(aggregated)
  const values = Object.values(aggregated)
  
  return {
    labels,
    values,
    chartData: labels.map((label, index) => ({
      label,
      value: values[index]
    }))
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
