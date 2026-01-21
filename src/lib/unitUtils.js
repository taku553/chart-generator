/**
 * 単位とスケール変換ユーティリティ
 */

/**
 * 単位のプリセット定義（翻訳キーを使用）
 * @param {Function} t - 翻訳関数
 */
export const getUnitPresets = (t) => ({
  currency: {
    label: t('unit.type.currency'),
    options: [
      { value: 'yen', label: t('unit.currency.yen'), symbol: t('unit.currency.yen'), prefix: '¥', suffix: '' },
      { value: 'dollar', label: t('unit.currency.dollar'), symbol: t('unit.currency.dollar'), prefix: '$', suffix: '' },
      { value: 'euro', label: t('unit.currency.euro'), symbol: t('unit.currency.euro'), prefix: '€', suffix: '' },
    ]
  },
  weight: {
    label: t('unit.type.weight'),
    options: [
      { value: 'kg', label: 'kg', symbol: 'kg', suffix: 'kg' },
      { value: 't', label: 't', symbol: 't', suffix: 't' },
      { value: 'g', label: 'g', symbol: 'g', suffix: 'g' },
    ]
  },
  count: {
    label: t('unit.type.count'),
    options: [
      { value: 'people', label: t('unit.count.people'), symbol: t('unit.count.people'), suffix: t('unit.count.people') },
      { value: 'items', label: t('unit.count.items'), symbol: t('unit.count.items'), suffix: t('unit.count.items') },
      { value: 'units', label: t('unit.count.units'), symbol: t('unit.count.units'), suffix: t('unit.count.units') },
    ]
  },
  percentage: {
    label: t('unit.type.percentage'),
    options: [
      { value: 'percent', label: '%', symbol: '%', suffix: '%' },
    ]
  },
  none: {
    label: t('unit.type.none'),
    options: [
      { value: 'none', label: t('unit.none.none'), symbol: '', suffix: '' },
    ]
  }
})

/**
 * スケール(基準値)のプリセット（翻訳キーを使用）
 * @param {Function} t - 翻訳関数
 */
export const getScalePresets = (t) => [
  { value: 1, label: t('unit.scale.1'), multiplier: 1 },
  { value: 10, label: t('unit.scale.10'), multiplier: 10 },
  { value: 100, label: t('unit.scale.100'), multiplier: 100 },
  { value: 1000, label: t('unit.scale.1000'), multiplier: 1000 },
  { value: 10000, label: t('unit.scale.10000'), multiplier: 10000 },
  { value: 100000, label: t('unit.scale.100000'), multiplier: 100000 },
  { value: 1000000, label: t('unit.scale.1000000'), multiplier: 1000000 },
  { value: 10000000, label: t('unit.scale.10000000'), multiplier: 10000000 },
  { value: 100000000, label: t('unit.scale.100000000'), multiplier: 100000000 },
  { value: 1000000000, label: t('unit.scale.1000000000'), multiplier: 1000000000 },
  { value: 10000000000, label: t('unit.scale.10000000000'), multiplier: 10000000000 },
  { value: 100000000000, label: t('unit.scale.100000000000'), multiplier: 100000000000 },
]

// 後方互換性のため、古い定義を維持（翻訳なし）
export const UNIT_PRESETS = {
  currency: {
    label: '通貨',
    options: [
      { value: 'yen', label: '円', symbol: '円', prefix: '¥', suffix: '' },
      { value: 'dollar', label: 'ドル', symbol: 'ドル', prefix: '$', suffix: '' },
      { value: 'euro', label: 'ユーロ', symbol: 'ユーロ', prefix: '€', suffix: '' },
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
 * スケール(基準値)のプリセット
 */
export const SCALE_PRESETS = [
  { value: 1, label: 'そのまま', multiplier: 1 },
  { value: 10, label: '十 (10)', multiplier: 10 },
  { value: 100, label: '百 (100)', multiplier: 100 },
  { value: 1000, label: '千 (1,000)', multiplier: 1000 },
  { value: 10000, label: '万 (10,000)', multiplier: 10000 },
  { value: 100000, label: '十万 (100,000)', multiplier: 100000 },
  { value: 1000000, label: '百万 (1,000,000)', multiplier: 1000000 },
  { value: 10000000, label: '千万 (10,000,000)', multiplier: 10000000 },
  { value: 100000000, label: '億 (100,000,000)', multiplier: 100000000 },
  { value: 1000000000, label: '十億 (1,000,000,000)', multiplier: 1000000000 },
  { value: 10000000000, label: '百億 (10,000,000,000)', multiplier: 10000000000 },
  { value: 100000000000, label: '千億 (100,000,000,000)', multiplier: 100000000000 },
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
export const formatValueWithUnit = (value, unitConfig, includeScaleLabel = false, t = null) => {
  if (!unitConfig) return String(value)

  const {
    scale = 1,
    unitType = 'none',
    selectedValue = '',
    decimals = 0,
    useThousandSeparator = true,
  } = unitConfig

  // 翻訳関数がある場合は現在の言語で単位を取得
  let unit = unitConfig.unit || ''
  let scaleLabel = unitConfig.scaleLabel || ''
  let prefix = unitConfig.prefix || ''
  let suffix = unitConfig.suffix || ''
  
  if (t && unitType && selectedValue) {
    const translatedUnitInfo = getUnitFromPreset(unitType, selectedValue, t)
    if (translatedUnitInfo.unit) {
      unit = translatedUnitInfo.unit
    }
    // prefix と suffix もプリセットから取得
    if (translatedUnitInfo.prefix !== undefined) {
      prefix = translatedUnitInfo.prefix
    }
    if (translatedUnitInfo.suffix !== undefined) {
      suffix = translatedUnitInfo.suffix
    }
  }
  
  if (t && scale > 1) {
    const translatedScaleLabel = getScaleLabel(scale, t)
    if (translatedScaleLabel) {
      scaleLabel = translatedScaleLabel
    }
  }

  // スケールを適用した値を表示
  const scaledValue = value

  // スケールラベルを含める場合（ツールチップやデータサマリー用）
  // suffix が空の場合（通貨など）は prefix + scaleLabel を使用
  let finalPrefix = prefix
  let finalSuffix = suffix
  
  if (includeScaleLabel && scaleLabel) {
    if (suffix) {
      // suffix がある場合（人、kg など）：scaleLabel + suffix
      finalSuffix = `${scaleLabel}${suffix}`
    } else if (prefix) {
      // prefix のみの場合（通貨など）：scaleLabel + prefix を前に
      finalPrefix = `${scaleLabel}${prefix}`
    } else {
      // どちらもない場合：scaleLabel のみ
      finalSuffix = scaleLabel
    }
  }

  return formatValue(scaledValue, {
    decimals,
    useThousandSeparator,
    prefix: finalPrefix,
    suffix: finalSuffix
  })
}

/**
 * 軸ラベルを生成する（翻訳対応版）
 * @param {string} columnName - 列名
 * @param {Object} unitConfig - 単位設定
 * @param {Function} t - 翻訳関数（オプション）
 * @returns {string} 軸ラベル
 */
export const generateAxisLabel = (columnName, unitConfig, t = null) => {
  if (!unitConfig) {
    return columnName
  }

  const { unitType = 'none', selectedValue = '', scale = 1 } = unitConfig

  // 翻訳関数がある場合は現在の言語で単位を取得
  let unit = unitConfig.unit || ''
  let scaleLabel = unitConfig.scaleLabel || ''
  let prefix = unitConfig.prefix || ''
  let suffix = unitConfig.suffix || ''
  
  if (t && unitType && selectedValue) {
    const translatedUnitInfo = getUnitFromPreset(unitType, selectedValue, t)
    if (translatedUnitInfo.unit) {
      unit = translatedUnitInfo.unit
    }
    if (translatedUnitInfo.prefix !== undefined) {
      prefix = translatedUnitInfo.prefix
    }
    if (translatedUnitInfo.suffix !== undefined) {
      suffix = translatedUnitInfo.suffix
    }
  }
  
  if (t && scale > 1) {
    const translatedScaleLabel = getScaleLabel(scale, t)
    if (translatedScaleLabel) {
      scaleLabel = translatedScaleLabel
    }
  }

  // 表示する単位を決定（prefix があれば prefix、なければ suffix）
  const displayUnit = prefix || suffix
  
  if (!displayUnit) {
    return columnName
  }

  if (scaleLabel && displayUnit) {
    return `${columnName} (${scaleLabel}${displayUnit})`
  } else if (displayUnit) {
    return `${columnName} (${displayUnit})`
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
 * プリセットから単位設定を取得（翻訳対応版）
 * @param {string} presetCategory - プリセットカテゴリー
 * @param {string} presetValue - プリセット値
 * @param {Function} t - 翻訳関数（オプション）
 * @returns {Object} 単位設定の一部
 */
export const getUnitFromPreset = (presetCategory, presetValue, t = null) => {
  // 翻訳関数がある場合は翻訳対応プリセットを使用
  const presets = t ? getUnitPresets(t) : UNIT_PRESETS
  
  const category = presets[presetCategory]
  if (!category) return {}

  const preset = category.options.find(opt => opt.value === presetValue)
  if (!preset) return {}

  return {
    unitType: presetCategory,
    unit: preset.label,
    suffix: preset.suffix || '',
    prefix: preset.prefix || '' 
  }
}

/**
 * スケールプリセットからラベルを取得（翻訳対応版）
 * @param {number} scaleValue - スケール値
 * @param {Function} t - 翻訳関数（オプション）
 * @returns {string} スケールラベル
 */
export const getScaleLabel = (scaleValue, t = null) => {
  // 基準値が1（そのまま）の場合は空文字列を返す
  // これにより、グラフ表示時に単位のみが表示される（例: "円" であって "そのまま円" ではない）
  if (scaleValue === 1) {
    return ''
  }
  
  // 翻訳関数がある場合は翻訳対応プリセットを使用
  const presets = t ? getScalePresets(t) : SCALE_PRESETS
  const preset = presets.find(p => p.value === scaleValue)
  if (!preset) return ''
  
  // ラベルから括弧部分を除いた部分を返す
  return preset.label.split(' ')[0]
}
