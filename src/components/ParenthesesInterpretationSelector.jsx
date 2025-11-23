import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx'
import { Label } from '@/components/ui/label.jsx'
import { AlertCircle, ArrowLeft, Home } from 'lucide-react'

export function ParenthesesInterpretationSelector({ 
  examples = [], 
  onConfirm, 
  onBack, 
  onReset,
  defaultMode = 'positive'
}) {
  const [mode, setMode] = useState(defaultMode)

  const handleConfirm = () => {
    onConfirm(mode)
  }

  // プレビュー例を生成
  const getPreviewValue = (example, selectedMode) => {
    // 括弧内の数値を抽出
    const match = example.match(/[\(（]\s*([\d,.\s]+)\s*[\)）]/)
    if (!match) return example
    
    const numStr = match[1].replace(/[\s,]/g, '')
    const num = parseFloat(numStr)
    
    if (isNaN(num)) return example
    
    if (selectedMode === 'negative') {
      return `-${num.toLocaleString()}`
    } else {
      return num.toLocaleString()
    }
  }

  return (
    <Card className="glass-card fade-in stagger-animation">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-500" />
          括弧付き数字の扱いについて
        </CardTitle>
        <CardDescription>
          データに括弧で囲まれた数字が含まれています。この括弧の意味を選択してください。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 検出された例 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            検出された括弧付き数字の例
          </h3>
          <ul className="text-blue-800 dark:text-blue-200 space-y-1 text-sm">
            {examples.slice(0, 3).map((example, index) => (
              <li key={index} className="font-mono">• {example}</li>
            ))}
          </ul>
        </div>

        {/* 選択肢 */}
        <RadioGroup value={mode} onValueChange={setMode}>
          <div className="space-y-4">
            {/* 正の数オプション */}
            <div className={`flex items-start space-x-3 rounded-lg border-2 p-4 transition-colors ${
              mode === 'positive' 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 dark:border-gray-700'
            }`}>
              <RadioGroupItem value="positive" id="positive" />
              <div className="flex-1">
                <Label 
                  htmlFor="positive" 
                  className="text-base font-semibold cursor-pointer"
                >
                  注釈や補足情報（正の数として扱う）
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  統計データで括弧が注釈番号や補足情報を示す場合に選択してください。
                </p>
                <div className="mt-2 text-sm">
                  <span className="text-gray-500">変換例: </span>
                  {examples[0] && (
                    <span className="font-mono">
                      {examples[0]} → {getPreviewValue(examples[0], 'positive')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 負の数オプション */}
            <div className={`flex items-start space-x-3 rounded-lg border-2 p-4 transition-colors ${
              mode === 'negative' 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 dark:border-gray-700'
            }`}>
              <RadioGroupItem value="negative" id="negative" />
              <div className="flex-1">
                <Label 
                  htmlFor="negative" 
                  className="text-base font-semibold cursor-pointer"
                >
                  会計表記の負数（マイナスとして扱う）
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  会計データで括弧が負の値を示す場合に選択してください。
                </p>
                <div className="mt-2 text-sm">
                  <span className="text-gray-500">変換例: </span>
                  {examples[0] && (
                    <span className="font-mono">
                      {examples[0]} → {getPreviewValue(examples[0], 'negative')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </RadioGroup>

        {/* プレビューセクション */}
        {examples.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              変換プレビュー
            </h4>
            <div className="space-y-2 text-sm">
              {examples.slice(0, 2).map((example, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-gray-500">元データ:</span>
                  <span className="font-mono font-semibold">{example}</span>
                  <span className="text-gray-400">→</span>
                  <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                    {getPreviewValue(example, mode)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ボタン */}
        <div className="flex gap-3 pt-4">
          <Button 
            variant="outline" 
            className="glass-button flex-1"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            前に戻る
          </Button>
          <Button 
            variant="outline" 
            className="glass-button"
            onClick={onReset}
          >
            <Home className="h-4 w-4 mr-2" />
            最初に戻る
          </Button>
          <Button 
            className="glass-button bg-black text-white hover:bg-gray-800 flex-1"
            onClick={handleConfirm}
          >
            確定して次へ
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
