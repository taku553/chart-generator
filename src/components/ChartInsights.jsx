import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { auth } from '@/lib/firebase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Sparkles, AlertCircle, Loader2, Crown, TrendingUp } from 'lucide-react'

export function ChartInsights({ chartData, isVisible = true }) {
  const { user } = useAuth()
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [remainingUsage, setRemainingUsage] = useState(null)
  const [dailyLimit, setDailyLimit] = useState(10)
  const [isComposing, setIsComposing] = useState(false)

  // 無料ユーザーの場合
  const isFreeUser = !user || user.plan === 'free'

  // AI解説リクエスト
  const handleAnalyze = async () => {
    if (!question.trim()) {
      setError('質問を入力してください')
      return
    }

    if (question.length > 500) {
      setError('質問は500文字以内で入力してください')
      return
    }

    setLoading(true)
    setError(null)
    setAnswer(null)

    try {
      // 認証トークンを取得
      const currentUser = auth.currentUser
      if (!currentUser) {
        setError('ログインが必要です。再度ログインしてください。')
        return
      }
      
      const token = await currentUser.getIdToken()

      // APIエンドポイント
      const apiUrl = '/api/analyze-chart'

      // グラフデータと元データの両方を送信
      const requestData = {
        chartData, // グラフ化されたデータ(変更後の名称含む)
        sourceData: chartData.sourceData, // 元の表データ全体と変更情報
        question: question.trim(),
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      })

      const data = await response.json()

      if (!response.ok) {
        // エラーハンドリング
        if (data.code === 'PREMIUM_REQUIRED') {
          setError('この機能はプレミアム会員限定です。アップグレードしてご利用ください。')
        } else if (data.code === 'RATE_LIMIT_EXCEEDED') {
          setError(data.error + '\n' + (data.resetTime || ''))
          setRemainingUsage(0)
          setDailyLimit(data.limit || 10)
        } else if (data.code === 'AUTH_INVALID') {
          setError('認証に失敗しました。再度ログインしてください。')
        } else {
          setError(data.error || 'エラーが発生しました')
        }
        return
      }

      // 成功時
      setAnswer(data.answer)
      setRemainingUsage(data.remainingUsage)
      setDailyLimit(data.dailyLimit)
    } catch (err) {
      console.error('AI解説エラー:', err)
      setError('通信エラーが発生しました。ネットワーク接続を確認してください。')
    } finally {
      setLoading(false)
    }
  }

  // IME変換開始
  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  // IME変換終了
  const handleCompositionEnd = () => {
    setIsComposing(false)
  }

  // Enter キーで送信（IME変換中は送信しない）
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // IME変換中の場合は送信しない
      if (isComposing || e.isComposing) {
        return
      }
      e.preventDefault()
      handleAnalyze()
    }
  }

  if (!isVisible || !chartData) {
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-purple-500" />
          <CardTitle>AI解説機能</CardTitle>
          {!isFreeUser && (
            <span className="ml-auto flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              <Crown className="size-3" />
              Premium
            </span>
          )}
        </div>
        <CardDescription>
          {isFreeUser
            ? 'グラフデータの傾向や特徴をAIが分析します（プレミアム会員限定）'
            : 'グラフデータの傾向や特徴についてAIに質問できます'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 無料ユーザー向けアップグレード誘導 */}
        {isFreeUser ? (
          <Alert className="border-amber-200 bg-amber-50">
            <Crown className="text-amber-600" />
            <AlertTitle className="text-amber-900">プレミアム会員限定機能</AlertTitle>
            <AlertDescription className="text-amber-800">
              AI解説機能を利用するには、プレミアムプランへのアップグレードが必要です。
              <br />
              <Button
                variant="default"
                size="sm"
                className="mt-3 bg-amber-600 hover:bg-amber-700"
                onClick={() => {
                  // TODO: アップグレードページへのナビゲーションを実装
                  alert('アップグレードページは準備中です')
                }}
              >
                <Crown className="mr-2 size-4" />
                プレミアムにアップグレード
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* 残り利用回数表示 */}
            {remainingUsage !== null && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-sm text-blue-900">
                  <TrendingUp className="size-4" />
                  <span>本日の残り利用回数</span>
                </div>
                <span className="text-lg font-bold text-blue-700">
                  {remainingUsage} / {dailyLimit}
                </span>
              </div>
            )}

            {/* 質問入力フォーム */}
            <div className="space-y-2">
              <Label htmlFor="question">グラフについて質問してください</Label>
              <Textarea
                id="question"
                placeholder="例：このデータの傾向を教えてください。最大値と最小値の差が大きい理由は何ですか？"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                disabled={loading}
                rows={3}
                maxLength={500}
                className="resize-none"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Enterキーで送信、Shift+Enterで改行</span>
                <span className={question.length > 450 ? 'text-destructive' : ''}>
                  {question.length} / 500
                </span>
              </div>
            </div>

            {/* 送信ボタン */}
            <Button
              onClick={handleAnalyze}
              disabled={loading || !question.trim() || question.length > 500}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  分析中...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 size-4" />
                  AI解説を取得
                </>
              )}
            </Button>

            {/* エラー表示 */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>エラー</AlertTitle>
                <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
              </Alert>
            )}

            {/* AI解説結果表示 */}
            {answer && (
              <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="size-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-900">AI解説結果</span>
                </div>
                <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {answer}
                </div>
              </div>
            )}

            {/* 注意事項 */}
            <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
              <p className="font-medium mb-1">💡 ご利用上の注意</p>
              <ul className="space-y-0.5 list-disc list-inside">
                <li>1日あたり{dailyLimit}回まで利用可能です</li>
                <li>利用回数は毎日0時（日本時間）にリセットされます</li>
                <li>AIの回答は参考情報であり、完全な正確性を保証するものではありません</li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
