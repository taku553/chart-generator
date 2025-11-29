import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, AlertCircle, CheckCircle2 } from 'lucide-react'

export function PasswordResetModal({ open, onOpenChange }) {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await resetPassword(email)
      setSuccess(true)
      setEmail('')
    } catch (err) {
      setError(getErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setError(null)
    setSuccess(false)
    onOpenChange(false)
  }

  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/user-not-found':
        return 'このメールアドレスは登録されていません'
      case 'auth/invalid-email':
        return 'メールアドレスの形式が正しくありません'
      case 'auth/too-many-requests':
        return 'リクエストが多すぎます。しばらく待ってから再度お試しください'
      case 'auth/user-disabled':
        return 'このアカウントは無効化されています'
      default:
        return 'エラーが発生しました。もう一度お試しください'
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>パスワードのリセット</DialogTitle>
          <DialogDescription>
            登録されているメールアドレスを入力してください。パスワードリセット用のリンクをお送りします。
          </DialogDescription>
        </DialogHeader>

        {success && (
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              パスワードリセット用のメールを送信しました。メールボックスをご確認ください。
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!success && (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">メールアドレス</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                キャンセル
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? '送信中...' : 'リセットメールを送信'}
              </Button>
            </div>
          </form>
        )}

        {success && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              メールが届かない場合は、迷惑メールフォルダもご確認ください。
            </p>
            <Button onClick={handleClose} className="w-full">
              閉じる
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
