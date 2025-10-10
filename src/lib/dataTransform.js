/**
 * データ変換ユーティリティ
 */

/**
 * データを転置する（行列を入れ替える）
 * @param {Array<Array<any>>} data - 2次元配列
 * @returns {Array<Array<any>>} 転置された2次元配列
 */
export const transposeData = (data) => {
  if (!data || data.length === 0) return []
  
  const maxLength = Math.max(...data.map(row => row.length))
  const transposed = []
  
  for (let colIndex = 0; colIndex < maxLength; colIndex++) {
    const newRow = []
    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      newRow.push(data[rowIndex][colIndex] || '')
    }
    transposed.push(newRow)
  }
  
  return transposed
}

/**
 * 選択されたデータ領域を処理する
 * @param {Object} config - 設定オブジェクト
 * @param {Array<Array<any>>} config.data - 元データ
 * @param {boolean} config.shouldTranspose - 転置するかどうか
 * @returns {Array<Array<any>>} 処理されたデータ
 */
export const processSelectedRange = ({ data, shouldTranspose }) => {
  let processedData = [...data.map(row => [...row])] // ディープコピー
  
  if (shouldTranspose) {
    processedData = transposeData(processedData)
  }
  
  // 完全に空の行を削除
  processedData = processedData.filter(row => 
    row.some(cell => {
      const cellValue = String(cell || '').trim()
      return cellValue !== ''
    })
  )
  
  return processedData
}

/**
 * データ領域を抽出する
 * @param {Array<Array<any>>} rawRows - 全データ
 * @param {Object} range - 範囲指定
 * @returns {Array<Array<any>>} 抽出されたデータ
 */
export const extractDataRange = (rawRows, { startRow, endRow, startCol, endCol }) => {
  if (!rawRows || rawRows.length === 0) return []
  
  const extractedData = []
  
  for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
    if (rowIndex >= rawRows.length) break
    
    const row = rawRows[rowIndex]
    const newRow = []
    
    for (let colIndex = startCol; colIndex <= endCol; colIndex++) {
      if (colIndex >= row.length) {
        newRow.push('')
      } else {
        newRow.push(row[colIndex])
      }
    }
    
    extractedData.push(newRow)
  }
  
  return extractedData
}

/**
 * 複数行からヘッダーを結合する
 * @param {Array<Array<any>>} data - データ
 * @param {number} headerStartRow - ヘッダー開始行（0始まり）
 * @param {number} headerEndRow - ヘッダー終了行（0始まり）
 * @returns {Array<string>} 結合されたヘッダー配列
 */
export const mergeHeaderRows = (data, headerStartRow, headerEndRow) => {
  if (!data || data.length === 0) return []
  if (headerStartRow > headerEndRow) return []
  if (headerEndRow >= data.length) return []
  
  const numColumns = Math.max(...data.slice(headerStartRow, headerEndRow + 1).map(row => row.length))
  const headers = []
  
  for (let colIndex = 0; colIndex < numColumns; colIndex++) {
    const headerParts = []
    
    for (let rowIndex = headerStartRow; rowIndex <= headerEndRow; rowIndex++) {
      const cell = data[rowIndex]?.[colIndex]
      const cellValue = String(cell || '').trim()
      
      if (cellValue !== '') {
        headerParts.push(cellValue)
      }
    }
    
    // 結合：空でない部分をスペースで連結
    const mergedHeader = headerParts.length > 0 
      ? headerParts.join(' ') 
      : `Column ${colIndex + 1}`
    
    headers.push(mergedHeader)
  }
  
  return headers
}

/**
 * ヘッダー領域とデータ領域を分けて抽出する
 * @param {Array<Array<any>>} data - 全データ
 * @param {number} headerStartRow - ヘッダー開始行
 * @param {number} headerEndRow - ヘッダー終了行
 * @param {number} dataStartRow - データ開始行
 * @returns {Object} { headers: Array<string>, data: Array<Array<any>> }
 */
export const extractHeadersAndDataRows = (data, headerStartRow, headerEndRow, dataStartRow) => {
  if (!data || data.length === 0) {
    return { headers: [], data: [] }
  }
  
  // ヘッダーを結合
  const headers = mergeHeaderRows(data, headerStartRow, headerEndRow)
  const numColumns = headers.length
  
  console.log('=== extractHeadersAndDataRows ===')
  console.log('Headers:', headers)
  console.log('Number of columns:', numColumns)
  
  // データ行を抽出（ヘッダーと同じ列数に揃える）
  const dataRows = []
  for (let rowIndex = dataStartRow; rowIndex < data.length; rowIndex++) {
    const row = data[rowIndex]
    
    // 完全に空の行はスキップ
    if (!row || !row.some(cell => String(cell || '').trim() !== '')) {
      continue
    }
    
    // 行の長さをヘッダーの列数に合わせる
    const normalizedRow = []
    for (let colIndex = 0; colIndex < numColumns; colIndex++) {
      const value = colIndex < row.length ? row[colIndex] : ''
      normalizedRow.push(value !== null && value !== undefined ? value : '')
    }
    
    dataRows.push(normalizedRow)
    
    // デバッグ用：最初の3行のみログ出力
    if (dataRows.length <= 3) {
      console.log(`Data row ${dataRows.length}:`, normalizedRow)
    }
  }
  
  console.log(`Total data rows extracted: ${dataRows.length}`)
  
  return { headers, data: dataRows }
}