import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Lock, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { validatePassword } from '@/lib/passwordValidator'

export function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { verifyResetCode, confirmPasswordReset } = useAuth()
  
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [validCode, setValidCode] = useState(false)

  const oobCode = searchParams.get('oobCode')

  // トークンの検証
  useEffect(() => {
    const verifyCode = async () => {
      if (!oobCode) {
        setError('無効なリンクです。パスワードリセットメールをもう一度ご確認ください。')
        setVerifying(false)
        return
      }

      try {
        const userEmail = await verifyResetCode(oobCode)
        setEmail(userEmail)
        setValidCode(true)
      } catch (err) {
        setError(getErrorMessage(err.code))
      } finally {
        setVerifying(false)
      }
    }

    verifyCode()
  }, [oobCode, verifyResetCode])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // パスワード確認
    if (newPassword !== confirmPassword) {
      setError('パスワードが一致しません')
      setLoading(false)
      return
    }

    // パスワード強度チェック
    const { isValid, errors } = validatePassword(newPassword)
    if (!isValid) {
      setError(`パスワードは以下を満たす必要があります: ${errors.join('、')}`)
      setLoading(false)
      return
    }

    try {
      await confirmPasswordReset(oobCode, newPassword)
      setSuccess(true)
      
      // 3秒後にログインページへ
      setTimeout(() => {
        navigate('/')
      }, 3000)
    } catch (err) {
      setError(getErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/expired-action-code':
        return 'このリンクは期限切れです。パスワードリセットをもう一度お試しください。'
      case 'auth/invalid-action-code':
        return 'このリンクは無効です。すでに使用されたか、正しくありません。'
      case 'auth/user-disabled':
        return 'このアカウントは無効化されています。'
      case 'auth/user-not-found':
        return 'ユーザーが見つかりません。'
      case 'auth/weak-password':
        return 'パスワードは英数字と記号を含む12文字以上で入力してください。'
      default:
        return 'エラーが発生しました。もう一度お試しください。'
    }
  }

  if (verifying) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg">
          <CardContent className="pt-6 flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            <p className="text-gray-600">リンクを確認しています...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>パスワードリセット完了</CardTitle>
            <CardDescription>
              パスワードが正常に変更されました。まもなくホームページに移動します。
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!validCode) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-center">リンクが無効です</CardTitle>
            <CardDescription className="text-center">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              ホームに戻る
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle>新しいパスワードの設定</CardTitle>
          <CardDescription>
            {email} のパスワードを再設定します
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">新しいパスワード</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="new-password"
                  type="password"
                  placeholder="英数字と記号を含む12文字以上"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10"
                  required
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-500">
                大文字、小文字、数字、記号(!@#$など)を含む12文字以上
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">パスワード(確認)</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="パスワードを再入力"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  設定中...
                </>
              ) : (
                'パスワードを設定'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
