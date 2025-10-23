/**
 * 単位とスケール変換ユーティリティ
 */

/**
 * 単位のプリセット定義
 */
export const UNIT_PRESETS = {
  currency: {
    label: '通貨',
    options: [
      { value: 'yen', label: '円', symbol: '円', suffix: '円' },
      { value: 'dollar', label: 'ドル', symbol: 'ドル', suffix: 'ドル' },
      { value: 'euro', label: 'ユーロ', symbol: 'ユーロ', suffix: 'ユーロ' },
    ]
  },
  weight: {
    label: '重量',
    options: [
      { value: 'kg', label: 'kg', symbol: 'kg', suffix: 'kg' },
      { value: 't', label: 't', symbol: 't', suffix: 't' },
      { value: 'g', label: 'g', symbol: 'g', suffix: 'g' },
    ]
  },
  count: {
    label: '数量',
    options: [
      { value: 'people', label: '人', symbol: '人', suffix: '人' },
      { value: 'items', label: '個', symbol: '個', suffix: '個' },
      { value: 'units', label: '件', symbol: '件', suffix: '件' },
    ]
  },
  percentage: {
    label: '割合',
    options: [
      { value: 'percent', label: '%', symbol: '%', suffix: '%' },
    ]
  },
  none: {
    label: '単位なし',
    options: [
      { value: 'none', label: 'なし', symbol: '', suffix: '' },
    ]
  }
}

/**
 * スケール（基準値）のプリセット
 */
export const SCALE_PRESETS = [
  { value: 1, label: 'そのまま (1)', multiplier: 1 },
  { value: 10, label: '十 (10)', multiplier: 10 },
  { value: 100, label: '百 (100)', multiplier: 100 },
  { value: 1000, label: '千 (1,000)', multiplier: 1000 },
  { value: 10000, label: '万 (10,000)', multiplier: 10000 },
  { value: 100000, label: '十万 (100,000)', multiplier: 100000 },
  { value: 1000000, label: '百万 (1,000,000)', multiplier: 1000000 },
  { value: 10000000, label: '千万 (10,000,000)', multiplier: 10000000 },
  { value: 100000000, label: '億 (100,000,000)', multiplier: 100000000 },
]

/**
 * 数値にスケールを適用する
 * @param {number} value - 元の値
 * @param {number} scale - スケール（乗数）
 * @returns {number} スケール適用後の値
 */
export const applyScale = (value, scale) => {
  if (typeof value !== 'number' || isNaN(value)) return value
  return value * scale
}

/**
 * スケールを解除する（表示用）
 * @param {number} value - スケール適用済みの値
 * @param {number} scale - スケール（乗数）
 * @returns {number} スケール解除後の値
 */
export const removeScale = (value, scale) => {
  if (typeof value !== 'number' || isNaN(value)) return value
  if (scale === 0) return value
  return value / scale
}

/**
 * 数値をフォーマットする
 * @param {number} value - フォーマットする値
 * @param {Object} options - フォーマットオプション
 * @param {number} options.decimals - 小数点以下の桁数
 * @param {boolean} options.useThousandSeparator - 千の位区切りを使用するか
 * @param {string} options.prefix - 接頭辞
 * @param {string} options.suffix - 接尾辞
 * @returns {string} フォーマットされた文字列
 */
export const formatValue = (value, options = {}) => {
  const {
    decimals = 0,
    useThousandSeparator = true,
    prefix = '',
    suffix = ''
  } = options

  if (typeof value !== 'number' || isNaN(value)) {
    return String(value)
  }

  // 小数点以下の桁数を適用
  let formatted = decimals > 0 
    ? value.toFixed(decimals)
    : Math.round(value).toString()

  // 千の位区切りを追加
  if (useThousandSeparator) {
    const parts = formatted.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    formatted = parts.join('.')
  }

  // 接頭辞と接尾辞を追加
  return `${prefix}${formatted}${suffix}`
}

/**
 * 単位設定に基づいて値をフォーマットする
 * @param {number} value - 元の値
 * @param {Object} unitConfig - 単位設定
 * @param {boolean} includeScaleLabel - スケールラベルを含めるかどうか
 * @returns {string} フォーマットされた文字列
 */
export const formatValueWithUnit = (value, unitConfig, includeScaleLabel = false) => {
  if (!unitConfig) return String(value)

  const {
    scale = 1,
    unit = '',
    scaleLabel = '',
    decimals = 0,
    useThousandSeparator = true,
    prefix = '',
    suffix = unit
  } = unitConfig

  // スケールを適用した値を表示
  const scaledValue = value

  // スケールラベルを含める場合（ツールチップやデータサマリー用）
  let finalSuffix = suffix
  if (includeScaleLabel && scaleLabel && unit) {
    finalSuffix = `${scaleLabel}${unit}`
  } else if (includeScaleLabel && scaleLabel && !unit) {
    finalSuffix = scaleLabel
  }

  return formatValue(scaledValue, {
    decimals,
    useThousandSeparator,
    prefix,
    suffix: finalSuffix
  })
}

/**
 * 軸ラベルを生成する
 * @param {string} columnName - 列名
 * @param {Object} unitConfig - 単位設定
 * @returns {string} 軸ラベル
 */
export const generateAxisLabel = (columnName, unitConfig) => {
  if (!unitConfig || !unitConfig.unit) {
    return columnName
  }

  const { unit, scaleLabel } = unitConfig

  if (scaleLabel && unit) {
    return `${columnName} (${scaleLabel}${unit})`
  } else if (unit) {
    return `${columnName} (${unit})`
  }

  return columnName
}

/**
 * デフォルトの単位設定を生成
 * @param {string} axis - 軸 ('x' | 'y')
 * @returns {Object} デフォルトの単位設定
 */
export const getDefaultUnitConfig = (axis = 'x') => {
  return {
    axis,
    unit: '',
    unitType: 'none',
    scale: 1,
    scaleLabel: '',
    decimals: 0,
    useThousandSeparator: true,
    prefix: '',
    suffix: ''
  }
}

/**
 * プリセットから単位設定を取得
 * @param {string} presetCategory - プリセットカテゴリー
 * @param {string} presetValue - プリセット値
 * @returns {Object} 単位設定の一部
 */
export const getUnitFromPreset = (presetCategory, presetValue) => {
  const category = UNIT_PRESETS[presetCategory]
  if (!category) return {}

  const preset = category.options.find(opt => opt.value === presetValue)
  if (!preset) return {}

  return {
    unitType: presetCategory,
    unit: preset.label,
    suffix: preset.suffix,
    prefix: '' // 接頭辞は使用しない（すべて接尾辞に統一）
  }
}

/**
 * スケールプリセットからラベルを取得
 * @param {number} scaleValue - スケール値
 * @returns {string} スケールラベル
 */
export const getScaleLabel = (scaleValue) => {
  const preset = SCALE_PRESETS.find(p => p.value === scaleValue)
  if (!preset) return ''
  
  // ラベルから括弧部分を除いた部分を返す
  return preset.label.split(' ')[0]
}
