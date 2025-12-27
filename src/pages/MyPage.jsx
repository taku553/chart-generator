import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Mail, Calendar, Crown, Settings, CheckCircle2 } from 'lucide-react'
import { ChangePasswordModal } from '@/components/ChangePasswordModal'
import { DeleteAccountModal } from '@/components/DeleteAccountModal'

export function MyPage() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // 決済完了メッセージ表示
  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (sessionId) {
      setShowSuccessMessage(true)
      // URLからsession_idパラメータを削除（クリーンなURL）
      searchParams.delete('session_id')
      setSearchParams(searchParams, { replace: true })
      
      // 5秒後にメッセージを非表示
      const timer = setTimeout(() => {
        setShowSuccessMessage(false)
      }, 10000)
      
      return () => clearTimeout(timer)
    }
  }, [searchParams, setSearchParams])

  const getUserInitial = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase()
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return 'U'
  }

  const formatDate = (dateString) => {
    if (!dateString) return '不明'
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* ページタイトル */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              マイページ
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              アカウント情報とプラン詳細
            </p>
          </div>

          {/* 決済完了メッセージ */}
          {showSuccessMessage && (
            <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              <AlertTitle className="text-green-900 dark:text-green-100 font-semibold">
                🎉 決済が完了しました！
              </AlertTitle>
              <AlertDescription className="text-green-800 dark:text-green-200">
                有料プランへのアップグレードが完了しました。すべての機能がご利用いただけます。
              </AlertDescription>
            </Alert>
          )}

          {/* プロフィールカード */}
          <Card>
            <CardHeader>
              <CardTitle>プロフィール</CardTitle>
              <CardDescription>基本的なアカウント情報</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.photoURL} alt={user?.displayName || user?.email} />
                  <AvatarFallback className="text-2xl">{getUserInitial()}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      ユーザー名
                    </label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {user?.displayName || '未設定'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        メールアドレス
                      </label>
                      <p className="text-gray-900 dark:text-gray-100">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        登録日
                      </label>
                      <p className="text-gray-900 dark:text-gray-100">
                        {formatDate(user?.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* プランカード */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                現在のプラン
              </CardTitle>
              <CardDescription>ご利用中のプラン情報</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      プラン
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={user?.plan !== 'free' ? 'default' : 'secondary'} className="text-base">
                        {user?.plan === 'free' ? '無料プラン' : 
                         user?.plan === 'standard' ? 'Standard プラン' :
                         user?.plan === 'pro' ? 'Pro プラン' : '有料プラン'}
                      </Badge>
                    </div>
                  </div>
                  
                  {user?.plan === 'free' && (
                    <Button variant="default">
                      有料プランにアップグレード
                    </Button>
                  )}
                </div>

                {user?.plan === 'free' && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      <strong>無料プラン</strong>では基本機能をご利用いただけます。
                      有料プランにアップグレードすると、以下の機能が利用可能になります:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-200">
                      <li>• グラフの高解像度エクスポート</li>
                      <li>• カスタムテーマの作成</li>
                      <li>• データ保存数の上限解除</li>
                      <li>• 優先サポート</li>
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 設定カード（将来の拡張用） */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                アカウント設定
              </CardTitle>
              <CardDescription>アカウントの管理</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" disabled>
                  プロフィールを編集
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => setShowPasswordModal(true)}
                  disabled={user?.providerData?.some(p => p.providerId === 'google.com')}
                >
                  パスワードを変更
                </Button>
                {user?.providerData?.some(p => p.providerId === 'google.com') && (
                  <p className="text-xs text-gray-500 mt-1 ml-1">
                    Googleログインユーザーはパスワード変更できません
                  </p>
                )}
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950" 
                  onClick={() => setShowDeleteModal(true)}
                >
                  アカウントを削除
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* パスワード変更モーダル */}
      <ChangePasswordModal 
        open={showPasswordModal} 
        onOpenChange={setShowPasswordModal} 
      />

      {/* アカウント削除モーダル */}
      <DeleteAccountModal 
        open={showDeleteModal} 
        onOpenChange={setShowDeleteModal} 
      />
    </div>
  )
}
