import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

export function DeleteAccountModal({ open, onOpenChange }) {
  const { user, deleteAccount } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState('confirm') // 'confirm' | 'reauthenticate'
  const [password, setPassword] = useState('')
  const [confirmText, setConfirmText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Googleユーザーかどうか
  const isGoogleUser = user?.providerData?.some(
    (provider) => provider.providerId === 'google.com'
  )

  // モーダルを閉じる時のリセット
  const handleClose = () => {
    setStep('confirm')
    setPassword('')
    setConfirmText('')
    setError('')
    onOpenChange(false)
  }

  // 最初の確認ステップ
  const handleConfirmStep = () => {
    if (confirmText !== '削除') {
      setError('「削除」と入力してください')
      return
    }
    setError('')
    setStep('reauthenticate')
  }

  // アカウント削除実行
  const handleDeleteAccount = async () => {
    console.log('🟢 DeleteAccountModal: handleDeleteAccount開始')
    setLoading(true)
    setError('')

    try {
      console.log('🟢 isGoogleUser:', isGoogleUser)
      console.log('🟢 password:', password ? '入力あり' : '入力なし')
      
      if (isGoogleUser) {
        // Googleユーザーの場合はポップアップで再認証
        await deleteAccount()
      } else {
        // メール・パスワードユーザーの場合
        if (!password) {
          setError('パスワードを入力してください')
          setLoading(false)
          return
        }
        await deleteAccount(password)
      }

      // 成功
      toast.success('アカウントが削除されました')
      handleClose()
      navigate('/')
    } catch (err) {
      console.error('アカウント削除エラー:', err)
      
      // エラーメッセージを分かりやすく
      let errorMessage = 'アカウント削除に失敗しました'
      
      if (err.code === 'auth/wrong-password') {
        errorMessage = 'パスワードが正しくありません'
      } else if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Googleログインがキャンセルされました'
      } else if (err.code === 'auth/requires-recent-login') {
        errorMessage = '再度ログインしてから削除してください'
      } else if (err.code === 'permission-denied') {
        errorMessage = 'Firestoreの削除権限がありません。セキュリティルールを確認してください。'
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            {step === 'confirm' ? 'アカウントを削除しますか？' : '本人確認'}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              {step === 'confirm' ? (
                <>
                  <p className="text-sm">
                    この操作は取り消すことができません。アカウントを削除すると、以下のデータが完全に削除されます：
                  </p>
                  <ul className="text-sm list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                    <li>プロフィール情報</li>
                    <li>プラン情報</li>
                    <li>保存されたすべてのデータ</li>
                  </ul>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-text">
                      続行するには <strong>「削除」</strong> と入力してください
                    </Label>
                    <Input
                      id="confirm-text"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder="削除"
                      disabled={loading}
                    />
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm">
                    {isGoogleUser
                      ? 'セキュリティのため、Googleアカウントで再度ログインする必要があります。「削除を確定」ボタンをクリックするとGoogleログイン画面が表示されます。'
                      : 'セキュリティのため、現在のパスワードを入力してください。'}
                  </p>
                  {!isGoogleUser && (
                    <div className="space-y-2">
                      <Label htmlFor="password">現在のパスワード</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="パスワードを入力"
                        disabled={loading}
                        autoFocus
                      />
                    </div>
                  )}
                </>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>キャンセル</AlertDialogCancel>
          {step === 'confirm' ? (
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault() // デフォルトの閉じる動作を防ぐ
                handleConfirmStep()
              }}
              disabled={loading || confirmText !== '削除'}
              className="bg-red-600 hover:bg-red-700"
            >
              続ける
            </AlertDialogAction>
          ) : (
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault() // デフォルトの閉じる動作を防ぐ
                handleDeleteAccount()
              }}
              disabled={loading || (!isGoogleUser && !password)}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  削除中...
                </>
              ) : (
                '削除を確定'
              )}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
