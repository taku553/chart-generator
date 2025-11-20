import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Mail, Calendar, Crown, Settings } from 'lucide-react'

export function MyPage() {
  const { user } = useAuth()

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
                      <Badge variant={user?.plan === 'premium' ? 'default' : 'secondary'} className="text-base">
                        {user?.plan === 'free' ? '無料プラン' : '有料プラン'}
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
                <Button variant="outline" className="w-full justify-start" disabled>
                  パスワードを変更
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700" disabled>
                  アカウントを削除
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                ※ これらの機能は近日公開予定です
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
