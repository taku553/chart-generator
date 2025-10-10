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