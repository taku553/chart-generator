import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { ArrowLeft, Ruler, Eye, ChevronDown, ChevronUp, Home } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  getUnitPresets,
  getScalePresets,
  getDefaultUnitConfig, 
  formatValueWithUnit,
  getUnitFromPreset,
  getScaleLabel 
} from '@/lib/unitUtils.js'

export function UnitSettings({ xColumn, yColumn, sampleData, headers, onConfirm, onBack, onReset }) {
  const { t } = useLanguage()
  const UNIT_PRESETS = getUnitPresets(t)
  const SCALE_PRESETS = getScalePresets(t)
  const [xUnitConfig, setXUnitConfig] = useState(getDefaultUnitConfig('x'))
  const [yUnitConfig, setYUnitConfig] = useState(getDefaultUnitConfig('y'))
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  // 有効なヘッダー（空欄でないもの）のみをフィルタリング
  const validHeaders = headers ? headers.filter(h => h && h.trim() !== '') : []

  // X軸の単位タイプ変更
  const handleXUnitTypeChange = (unitType) => {
    const firstOption = UNIT_PRESETS[unitType]?.options[0]
    if (firstOption) {
      const unitInfo = getUnitFromPreset(unitType, firstOption.value, t)
      setXUnitConfig(prev => ({
        ...prev,
        ...unitInfo,
        selectedValue: firstOption.value
      }))
    } else {
      setXUnitConfig(prev => ({
        ...prev,
        unitType,
        unit: '',
        suffix: '',
        prefix: '',
        selectedValue: ''
      }))
    }
  }

  // Y軸の単位タイプ変更
  const handleYUnitTypeChange = (unitType) => {
    const firstOption = UNIT_PRESETS[unitType]?.options[0]
    if (firstOption) {
      const unitInfo = getUnitFromPreset(unitType, firstOption.value, t)
      setYUnitConfig(prev => ({
        ...prev,
        ...unitInfo,
        selectedValue: firstOption.value
      }))
    } else {
      setYUnitConfig(prev => ({
        ...prev,
        unitType,
        unit: '',
        suffix: '',
        prefix: '',
        selectedValue: ''
      }))
    }
  }

  // X軸の具体的な単位変更
  const handleXUnitValueChange = (unitValue) => {
    const unitInfo = getUnitFromPreset(xUnitConfig.unitType, unitValue, t)
    setXUnitConfig(prev => ({
      ...prev,
      ...unitInfo,
      selectedValue: unitValue
    }))
  }

  // Y軸の具体的な単位変更
  const handleYUnitValueChange = (unitValue) => {
    const unitInfo = getUnitFromPreset(yUnitConfig.unitType, unitValue, t)
    setYUnitConfig(prev => ({
      ...prev,
      ...unitInfo,
      selectedValue: unitValue
    }))
  }

  // X軸のスケール変更
  const handleXScaleChange = (scaleValue) => {
    const scale = parseInt(scaleValue)
    setXUnitConfig(prev => ({
      ...prev,
      scale,
      scaleLabel: getScaleLabel(scale, t)
    }))
  }

  // Y軸のスケール変更
  const handleYScaleChange = (scaleValue) => {
    const scale = parseInt(scaleValue)
    setYUnitConfig(prev => ({
      ...prev,
      scale,
      scaleLabel: getScaleLabel(scale, t)
    }))
  }

  // 確定ボタンのハンドラー
  const handleConfirmClick = () => {
    onConfirm({
      x: xUnitConfig,
      y: yUnitConfig
    })
  }

  // プレビュー用のサンプル値を取得
  const getSampleValue = (column) => {
    if (!sampleData || sampleData.length === 0) return null
    
    // 最初の数値を見つける
    for (const row of sampleData) {
      const value = row[column]
      if (typeof value === 'number' && !isNaN(value)) {
        return value
      }
      // 文字列の場合は数値に変換を試みる
      const numValue = parseFloat(String(value).replace(/,/g, ''))
      if (!isNaN(numValue)) {
        return numValue
      }
    }
    return null
  }

  const xSampleValue = getSampleValue(xColumn)
  const ySampleValue = getSampleValue(yColumn)

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          className="glass-button"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('unit.back')}
        </Button>
        
        {onReset && (
          <Button 
            variant="outline" 
            className="glass-button"
            onClick={onReset}
          >
            <Home className="h-4 w-4 mr-2" />
            {t('unit.returnToStart')}
          </Button>
        )}
      </div>

      <Card className="glass-card fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            {t('unit.title')}
          </CardTitle>
          <CardDescription>
            {t('unit.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* X軸の設定 */}
          <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-800/50">
            <h3 className="font-semibold text-lg">{t('unit.xAxis')}: {xColumn}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 単位タイプ選択 */}
              <div className="space-y-2">
                <Label>{t('unit.unitType')}</Label>
                <Select 
                  value={xUnitConfig.unitType} 
                  onValueChange={handleXUnitTypeChange}
                >
                  <SelectTrigger className="glass-button">
                    <SelectValue placeholder={t('unit.selectUnitType')} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(UNIT_PRESETS).map(([key, preset]) => (
                      <SelectItem key={key} value={key}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 具体的な単位選択 */}
              {xUnitConfig.unitType && xUnitConfig.unitType !== 'none' && (
                <div className="space-y-2">
                  <Label>{t('unit.unit')}</Label>
                  <Select 
                    value={xUnitConfig.selectedValue || ''}
                    onValueChange={handleXUnitValueChange}
                  >
                    <SelectTrigger className="glass-button">
                      <SelectValue placeholder={t('unit.selectUnit')} />
                    </SelectTrigger>
                    <SelectContent>
                      {UNIT_PRESETS[xUnitConfig.unitType]?.options.map((option) => (
                        option.value && <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* スケール選択 */}
              <div className="space-y-2">
                <Label>{t('unit.scale')}</Label>
                <Select 
                  value={String(xUnitConfig.scale)} 
                  onValueChange={handleXScaleChange}
                >
                  <SelectTrigger className="glass-button">
                    <SelectValue placeholder={t('unit.selectScale')} />
                  </SelectTrigger>
                  <SelectContent>
                    {SCALE_PRESETS.map((preset) => (
                      <SelectItem key={preset.value} value={String(preset.value)}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* プレビュー */}
            {xSampleValue !== null && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">{t('unit.preview')}</span>
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  {t('unit.dataValue')}: {xSampleValue.toLocaleString()}
                  {xUnitConfig.scale > 1 && (
                    <> (× {xUnitConfig.scaleLabel || xUnitConfig.scale.toLocaleString()})</>
                  )}
                  {' '}→ {t('unit.display')}: <strong>{formatValueWithUnit(xSampleValue, xUnitConfig, true, t)}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Y軸の設定 */}
          <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-800/50">
            <h3 className="font-semibold text-lg">{t('unit.yAxis')}: {yColumn}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 単位タイプ選択 */}
              <div className="space-y-2">
                <Label>{t('unit.unitType')}</Label>
                <Select 
                  value={yUnitConfig.unitType} 
                  onValueChange={handleYUnitTypeChange}
                >
                  <SelectTrigger className="glass-button">
                    <SelectValue placeholder={t('unit.selectUnitType')} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(UNIT_PRESETS).map(([key, preset]) => (
                      <SelectItem key={key} value={key}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 具体的な単位選択 */}
              {yUnitConfig.unitType && yUnitConfig.unitType !== 'none' && (
                <div className="space-y-2">
                  <Label>{t('unit.unit')}</Label>
                  <Select 
                    value={yUnitConfig.selectedValue || ''}
                    onValueChange={handleYUnitValueChange}
                  >
                    <SelectTrigger className="glass-button">
                      <SelectValue placeholder={t('unit.selectUnit')} />
                    </SelectTrigger>
                    <SelectContent>
                      {UNIT_PRESETS[yUnitConfig.unitType]?.options.map((option) => (
                        option.value && <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* スケール選択 */}
              <div className="space-y-2">
                <Label>{t('unit.scale')}</Label>
                <Select 
                  value={String(yUnitConfig.scale)} 
                  onValueChange={handleYScaleChange}
                >
                  <SelectTrigger className="glass-button">
                    <SelectValue placeholder={t('unit.selectScale')} />
                  </SelectTrigger>
                  <SelectContent>
                    {SCALE_PRESETS.map((preset) => (
                      <SelectItem key={preset.value} value={String(preset.value)}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* プレビュー */}
            {ySampleValue !== null && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">{t('unit.preview')}</span>
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  {t('unit.dataValue')}: {ySampleValue.toLocaleString()}
                  {yUnitConfig.scale > 1 && (
                    <> (× {yUnitConfig.scaleLabel || yUnitConfig.scale.toLocaleString()})</>
                  )}
                  {' '}→ {t('unit.display')}: <strong>{formatValueWithUnit(ySampleValue, yUnitConfig, true, t)}</strong>
                </div>
              </div>
            )}
          </div>

          {/* 詳細設定（将来の拡張用） */}
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <span>{t('unit.showAdvanced')}</span>
              {showAdvanced ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            {showAdvanced && (
              <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Y軸の小数点以下桁数 */}
                  <div className="space-y-2">
                    <Label>{t('unit.decimalPlaces')}</Label>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      value={yUnitConfig.decimals}
                      onChange={(e) => setYUnitConfig(prev => ({
                        ...prev,
                        decimals: parseInt(e.target.value) || 0
                      }))}
                      className="glass-button"
                    />
                  </div>

                  {/* Y軸の千の位区切り */}
                  <div className="space-y-2">
                    <Label className="flex items-center justify-between">
                      <span>{t('unit.useComma')}</span>
                      <Switch
                        checked={yUnitConfig.useThousandSeparator}
                        onCheckedChange={(checked) => setYUnitConfig(prev => ({
                          ...prev,
                          useThousandSeparator: checked
                        }))}
                      />
                    </Label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 説明文 */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
              {t('unit.scaleInfo')}
            </h4>
            <p className="text-amber-800 dark:text-amber-200 text-sm">
              {t('unit.scaleExample')}
            </p>
          </div>

          {/* 確定ボタン */}
          <Button 
            className="w-full glass-button bg-black text-white hover:bg-gray-800" 
            onClick={handleConfirmClick}
          >
            {t('unit.next')}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
