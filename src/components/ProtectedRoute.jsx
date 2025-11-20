import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // ローディング中は何も表示しない（またはローディング画面）
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    )
  }

  // 未ログインの場合はホームページにリダイレクト
  // 元のURLを state に保存して、ログイン後に戻れるようにする
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  // ログイン済みの場合はコンテンツを表示
  return children
}
