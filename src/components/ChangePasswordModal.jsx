import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Lock, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { validatePassword, getPasswordStrength } from '@/lib/passwordValidator'

export function ChangePasswordModal({ open, onOpenChange }) {
  const { changePassword } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // パスワード強度の計算
  const passwordStrength = getPasswordStrength(newPassword)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    // 新しいパスワードの確認
    if (newPassword !== confirmPassword) {
      setError('新しいパスワードが一致しません')
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

    // 現在のパスワードと同じかチェック
    if (currentPassword === newPassword) {
      setError('新しいパスワードは現在のパスワードと異なるものにしてください')
      setLoading(false)
      return
    }

    try {
      await changePassword(currentPassword, newPassword)
      setSuccess(true)

      // 成功後、2秒後にモーダルを閉じる
      setTimeout(() => {
        handleClose()
      }, 2000)
    } catch (err) {
      const errorMessage = getErrorMessage(err.code || err.message)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setError(null)
    setSuccess(false)
    onOpenChange(false)
  }

  const getErrorMessage = (code) => {
    if (typeof code === 'string') {
      if (code.includes('Googleログイン')) {
        return code
      }
      if (code.includes('ログインしていません')) {
        return code
      }
    }

    switch (code) {
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return '現在のパスワードが正しくありません'
      case 'auth/weak-password':
        return 'パスワードは英数字と記号を含む12文字以上で入力してください'
      case 'auth/requires-recent-login':
        return 'セキュリティのため、再ログインしてからお試しください'
      case 'auth/too-many-requests':
        return '試行回数が多すぎます。しばらく時間をおいてからお試しください'
      default:
        return 'パスワードの変更に失敗しました。もう一度お試しください'
    }
  }

  const getStrengthColor = () => {
    switch (passwordStrength.strength) {
      case 'strong':
        return 'text-green-600 dark:text-green-400'
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400'
      default:
        return 'text-red-600 dark:text-red-400'
    }
  }

  const getStrengthLabel = () => {
    switch (passwordStrength.strength) {
      case 'strong':
        return '強力'
      case 'medium':
        return '中程度'
      default:
        return '弱い'
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>パスワード変更</DialogTitle>
          <DialogDescription>
            セキュリティのため、現在のパスワードを入力してください
          </DialogDescription>
        </DialogHeader>

        {/* 成功メッセージ */}
        {success && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              パスワードを変更しました
            </AlertDescription>
          </Alert>
        )}

        {/* エラーメッセージ */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 現在のパスワード */}
          <div className="space-y-2">
            <Label htmlFor="current-password">現在のパスワード</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="current-password"
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="現在のパスワード"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="pl-10 pr-10"
                required
                disabled={loading || success}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                disabled={loading || success}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* 新しいパスワード */}
          <div className="space-y-2">
            <Label htmlFor="new-password">新しいパスワード</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="new-password"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="英数字と記号を含む12文字以上"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10 pr-10"
                required
                disabled={loading || success}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                disabled={loading || success}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {newPassword && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">パスワード強度:</span>
                  <span className={`font-medium ${getStrengthColor()}`}>
                    {getStrengthLabel()}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      passwordStrength.strength === 'strong'
                        ? 'bg-green-500'
                        : passwordStrength.strength === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${passwordStrength.score}%` }}
                  />
                </div>
              </div>
            )}
            <p className="text-xs text-gray-500">
              大文字、小文字、数字、記号(!@#$など)を含む12文字以上
            </p>
          </div>

          {/* 新しいパスワード（確認） */}
          <div className="space-y-2">
            <Label htmlFor="confirm-password">新しいパスワード（確認）</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="パスワードを再入力"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10"
                required
                disabled={loading || success}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                disabled={loading || success}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading || success}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={loading || success}>
              {loading ? '変更中...' : success ? '変更完了' : 'パスワードを変更'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
