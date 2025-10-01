import Papa from 'papaparse'

/**
 * CSVファイルを解析してデータを返す
 * @param {File} file - アップロードされたファイル
 * @returns {Promise<Object>} 解析されたデータ
 */
export const parseCSVFile = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error('CSVファイルの解析中にエラーが発生しました'))
          return
        }
        
        const data = results.data
        if (data.length === 0) {
          reject(new Error('ファイルにデータが含まれていません'))
          return
        }

        // ヘッダーを取得
        const headers = Object.keys(data[0])
        if (headers.length < 2) {
          reject(new Error('最低2列のデータが必要です'))
          return
        }

        resolve({
          headers,
          data,
          rowCount: data.length
        })
      },
      error: (error) => {
        reject(new Error('ファイルの読み込みに失敗しました'))
      }
    })
  })
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
export const transformDataForChart = (rawData, xColumn, yColumn) => {
  const { data } = rawData
  
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
